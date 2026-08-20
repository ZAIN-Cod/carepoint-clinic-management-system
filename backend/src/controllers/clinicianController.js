import Clinician from '../models/Clinician.js'
import AppError from '../utils/AppError.js'

export async function getClinicians(req, res, next) {
  try {
    const { search, specialization, status } = req.query
    const filter = {}

    if (specialization && specialization !== 'All') {
      filter.specialization = specialization
    }

    if (status && status !== 'All') {
      filter.status = status
    }

    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ name: regex }, { email: regex }, { specialization: regex }]
    }

    const clinicians = await Clinician.find(filter).sort({ name: 1 })
    res.status(200).json({ success: true, count: clinicians.length, data: clinicians })
  } catch (error) {
    next(error)
  }
}

export async function getClinicianById(req, res, next) {
  try {
    const clinician = await Clinician.findById(req.params.id)
    if (!clinician) {
      return next(new AppError('Clinician not found.', 404))
    }
    res.status(200).json({ success: true, data: clinician })
  } catch (error) {
    next(error)
  }
}

export async function createClinician(req, res, next) {
  try {
    const { name, email, specialization, status, initials } = req.body

    if (!name || !email || !specialization) {
      return next(new AppError('Name, email, and specialization are required.', 400))
    }

    const initialsCalc = initials || name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

    const clinician = await Clinician.create({
      name,
      email,
      specialization,
      status: status || 'Active',
      initials: initialsCalc,
    })

    res.status(201).json({ success: true, data: clinician })
  } catch (error) {
    next(error)
  }
}
