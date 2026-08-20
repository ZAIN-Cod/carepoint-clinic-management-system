import Appointment from '../models/Appointment.js'
import Clinician from '../models/Clinician.js'
import Invoice from '../models/Invoice.js'
import Patient from '../models/Patient.js'

export async function getAnalytics(req, res, next) {
  try {
    const totalPatients = await Patient.countDocuments()
    const totalAppointments = await Appointment.countDocuments()
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' })
    const activeClinicians = await Clinician.countDocuments({ status: 'Active' })

    const invoices = await Invoice.find()
    const totalRevenue = invoices.reduce((sum, inv) => (inv.status === 'Paid' ? sum + inv.amount : sum), 0)

    const departmentStats = [
      { name: 'Cardiology', count: await Appointment.countDocuments({ department: 'Cardiology' }), percentage: 38 },
      { name: 'General Practice', count: await Appointment.countDocuments({ department: 'General Practice' }), percentage: 42 },
      { name: 'Dental', count: await Appointment.countDocuments({ department: 'Dental' }), percentage: 20 },
    ]

    const monthlyRevenue = [
      { month: 'Jul', revenue: 14200 },
      { month: 'Aug', revenue: 18500 },
      { month: 'Sep', revenue: 16900 },
      { month: 'Oct', revenue: 21400 },
      { month: 'Nov', revenue: 24850 },
      { month: 'Dec', revenue: 19300 },
    ]

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalPatients,
          totalAppointments,
          completedAppointments,
          activeClinicians,
          totalRevenue,
          occupancyRate: '84%',
        },
        departmentStats,
        monthlyRevenue,
      },
    })
  } catch (error) {
    next(error)
  }
}
