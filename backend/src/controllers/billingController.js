import Invoice from '../models/Invoice.js'
import Patient from '../models/Patient.js'
import AppError from '../utils/AppError.js'

export async function getInvoices(req, res, next) {
  try {
    const { status, search } = req.query
    const filter = {}

    if (status && status !== 'All') {
      filter.status = status
    }

    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ invoiceCode: regex }, { service: regex }]
    }

    const invoices = await Invoice.find(filter)
      .populate('patient', 'firstName lastName patientCode email phone')
      .sort({ createdAt: -1 })

    const totalRevenue = invoices.reduce((acc, inv) => (inv.status === 'Paid' ? acc + inv.amount : acc), 0)
    const pendingAmount = invoices.reduce((acc, inv) => (inv.status !== 'Paid' ? acc + inv.amount : acc), 0)

    res.status(200).json({
      success: true,
      count: invoices.length,
      metrics: {
        totalRevenue,
        pendingAmount,
        paidCount: invoices.filter((i) => i.status === 'Paid').length,
        pendingCount: invoices.filter((i) => i.status !== 'Paid').length,
      },
      data: invoices,
    })
  } catch (error) {
    next(error)
  }
}

export async function createInvoice(req, res, next) {
  try {
    let { patientId, service, amount, dueDate, notes } = req.body

    if (!service || !amount) {
      return next(new AppError('Service and amount are required.', 400))
    }

    if (!patientId) {
      const defaultPatient = await Patient.findOne()
      if (defaultPatient) patientId = defaultPatient._id
      else return next(new AppError('Patient reference is required.', 400))
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const invoiceCode = `INV-2026-${randomNum}`

    const invoice = await Invoice.create({
      invoiceCode,
      patient: patientId,
      service,
      amount: Number(amount),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Pending',
      notes,
    })

    const populated = await Invoice.findById(invoice._id).populate('patient', 'firstName lastName patientCode')

    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export async function markAsPaid(req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status: 'Paid' }, { new: true }).populate('patient')
    if (!invoice) {
      return next(new AppError('Invoice not found.', 404))
    }
    res.status(200).json({ success: true, data: invoice })
  } catch (error) {
    next(error)
  }
}
