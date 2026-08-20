import Appointment from '../models/Appointment.js'
import Clinician from '../models/Clinician.js'
import Patient from '../models/Patient.js'
import AppError from '../utils/AppError.js'

export async function getAppointments(req, res, next) {
  try {
    const { department, status, date } = req.query
    const filter = {}

    if (department && department !== 'All') {
      filter.department = department
    }
    if (status && status !== 'All') {
      filter.status = status
    }
    if (date) {
      filter.date = new Date(date)
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName email phone patientCode')
      .populate('clinician', 'name specialization initials email')
      .sort({ date: 1, time: 1 })

    res.status(200).json({ success: true, count: appointments.length, data: appointments })
  } catch (error) {
    next(error)
  }
}

export async function getAppointmentById(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('clinician')

    if (!appointment) {
      return next(new AppError('Appointment not found.', 404))
    }
    res.status(200).json({ success: true, data: appointment })
  } catch (error) {
    next(error)
  }
}

export async function createAppointment(req, res, next) {
  try {
    let { patientId, clinicianId, service, date, time, notes, status, department } = req.body

    if (!service || !date || !time) {
      return next(new AppError('Service, date, and time are required.', 400))
    }

    // If patientId missing, check if fallback default patient or first patient exists
    if (!patientId) {
      const defaultPatient = await Patient.findOne()
      if (defaultPatient) {
        patientId = defaultPatient._id
      } else {
        return next(new AppError('Please select or register a patient first.', 400))
      }
    }

    // If clinicianId missing, pick first clinician
    if (!clinicianId) {
      const defaultClinician = await Clinician.findOne()
      if (defaultClinician) {
        clinicianId = defaultClinician._id
      } else {
        return next(new AppError('No available clinician found.', 400))
      }
    }

    const clinicianDoc = await Clinician.findById(clinicianId)
    const dept = department || (clinicianDoc ? clinicianDoc.specialization : 'General Practice')

    const appointment = await Appointment.create({
      patient: patientId,
      clinician: clinicianId,
      service,
      date: new Date(date),
      time,
      notes,
      status: status || 'Scheduled',
      department: dept,
    })

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'firstName lastName email phone')
      .populate('clinician', 'name specialization initials')

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('patient')
      .populate('clinician')

    if (!appointment) {
      return next(new AppError('Appointment not found.', 404))
    }
    res.status(200).json({ success: true, data: appointment })
  } catch (error) {
    next(error)
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) {
      return next(new AppError('Appointment not found.', 404))
    }
    res.status(200).json({ success: true, message: 'Appointment deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
