import Clinician from '../models/Clinician.js'
import Patient from '../models/Patient.js'
import Prescription from '../models/Prescription.js'
import AppError from '../utils/AppError.js'

export async function getPrescriptions(req, res, next) {
  try {
    const { status, search } = req.query
    const filter = {}

    if (status && status !== 'All') {
      filter.status = status
    }

    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ medicationName: regex }, { dosage: regex }, { notes: regex }]
    }

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'firstName lastName patientCode email')
      .populate('clinician', 'name specialization')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions })
  } catch (error) {
    next(error)
  }
}

export async function createPrescription(req, res, next) {
  try {
    let { patientId, clinicianId, medicationName, dosage, frequency, duration, refills, notes } = req.body

    if (!medicationName || !dosage || !frequency) {
      return next(new AppError('Medication name, dosage, and frequency are required.', 400))
    }

    if (!patientId) {
      const defaultPatient = await Patient.findOne()
      if (defaultPatient) patientId = defaultPatient._id
      else return next(new AppError('Patient is required.', 400))
    }

    if (!clinicianId) {
      const defaultClinician = await Clinician.findOne()
      if (defaultClinician) clinicianId = defaultClinician._id
      else return next(new AppError('Clinician is required.', 400))
    }

    const prescription = await Prescription.create({
      patient: patientId,
      clinician: clinicianId,
      medicationName,
      dosage,
      frequency,
      duration: duration || '7 days',
      refills: refills ? Number(refills) : 0,
      status: 'Active',
      notes,
    })

    const populated = await Prescription.findById(prescription._id)
      .populate('patient', 'firstName lastName patientCode')
      .populate('clinician', 'name specialization')

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export async function requestRefill(req, res, next) {
  try {
    const prescription = await Prescription.findById(req.params.id)
    if (!prescription) {
      return next(new AppError('Prescription not found.', 404))
    }

    prescription.refills += 1
    await prescription.save()

    res.status(200).json({ success: true, message: 'Refill requested successfully', data: prescription })
  } catch (error) {
    next(error)
  }
}
