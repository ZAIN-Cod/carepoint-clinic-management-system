import Patient from '../models/Patient.js'
import AppError from '../utils/AppError.js'

export async function getPatients(req, res, next) {
  try {
    const { search } = req.query
    let filter = {}

    if (search) {
      const regex = new RegExp(search, 'i')
      filter = {
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { phone: regex }, { patientCode: regex }],
      }
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: patients.length, data: patients })
  } catch (error) {
    next(error)
  }
}

export async function getPatientById(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return next(new AppError('Patient not found.', 404))
    }
    res.status(200).json({ success: true, data: patient })
  } catch (error) {
    next(error)
  }
}

export async function createPatient(req, res, next) {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, medicalNotes } = req.body

    if (!firstName || !lastName || !phone || !dateOfBirth) {
      return next(new AppError('First name, last name, phone, and date of birth are required.', 400))
    }

    // Auto-generate patientCode if not provided
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const patientCode = req.body.patientCode || `#DF-${randomSuffix}-${Math.floor(10 + Math.random() * 90)}`

    const patient = await Patient.create({
      patientCode,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      medicalNotes,
    })

    res.status(201).json({ success: true, data: patient })
  } catch (error) {
    next(error)
  }
}

export async function updatePatient(req, res, next) {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!patient) {
      return next(new AppError('Patient not found.', 404))
    }
    res.status(200).json({ success: true, data: patient })
  } catch (error) {
    next(error)
  }
}

export async function deletePatient(req, res, next) {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) {
      return next(new AppError('Patient not found.', 404))
    }
    res.status(200).json({ success: true, message: 'Patient record deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
