import MedicalRecord from '../models/MedicalRecord.js'
import Patient from '../models/Patient.js'
import AppError from '../utils/AppError.js'

export async function getMedicalRecords(req, res, next) {
  try {
    const { recordType, search, patientId } = req.query
    const filter = {}

    if (recordType && recordType !== 'All') {
      filter.recordType = recordType
    }

    if (patientId) {
      filter.patient = patientId
    }

    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ title: regex }, { notes: regex }]
    }

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'firstName lastName patientCode email phone')
      .populate('clinician', 'name specialization')
      .sort({ date: -1 })

    res.status(200).json({ success: true, count: records.length, data: records })
  } catch (error) {
    next(error)
  }
}

export async function createMedicalRecord(req, res, next) {
  try {
    let { patientId, clinicianId, recordType, title, notes, date, status } = req.body

    if (!title) {
      return next(new AppError('Record title is required.', 400))
    }

    if (!patientId) {
      const defaultPatient = await Patient.findOne()
      if (defaultPatient) {
        patientId = defaultPatient._id
      } else {
        return next(new AppError('Patient reference is required.', 400))
      }
    }

    const record = await MedicalRecord.create({
      patient: patientId,
      clinician: clinicianId || undefined,
      recordType: recordType || 'Procedure Note',
      title,
      notes,
      date: date ? new Date(date) : new Date(),
      status: status || 'Final',
    })

    const populated = await MedicalRecord.findById(record._id)
      .populate('patient', 'firstName lastName patientCode')
      .populate('clinician', 'name specialization')

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}
