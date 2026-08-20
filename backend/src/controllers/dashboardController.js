import Appointment from '../models/Appointment.js'
import Clinician from '../models/Clinician.js'
import Patient from '../models/Patient.js'

export async function getDashboardStats(req, res, next) {
  try {
    const totalPatients = await Patient.countDocuments()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const todaysAppts = await Appointment.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
    })

    const availableDoctors = await Clinician.countDocuments({ status: 'Active' })
    const pendingAppts = await Appointment.countDocuments({ status: 'Pending' })

    const upcomingAppointmentsDocs = await Appointment.find()
      .populate('patient', 'firstName lastName patientCode')
      .populate('clinician', 'name specialization initials')
      .sort({ date: 1, time: 1 })
      .limit(5)

    const upcomingAppointments = upcomingAppointmentsDocs.map((appt) => {
      const patientName = appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'Unknown Patient'
      const clinicianName = appt.clinician ? appt.clinician.name : 'Unassigned Doctor'
      const initials = appt.patient
        ? `${appt.patient.firstName.charAt(0)}${appt.patient.lastName.charAt(0)}`
        : 'P'

      return {
        id: appt._id,
        patient: patientName,
        initials,
        detail: `${appt.service} · ${clinicianName}`,
        time: appt.time,
        status: appt.status,
      }
    })

    const stats = [
      { label: 'Total patients', value: totalPatients.toLocaleString(), note: 'Registered patients', tone: 'teal', symbol: '◌' },
      { label: "Today's appts", value: todaysAppts.toString(), note: `${pendingAppts} pending approval`, tone: 'blue', symbol: '▣' },
      { label: 'Available doctors', value: availableDoctors.toString(), note: 'Active clinicians', tone: 'cyan', symbol: '+' },
      { label: 'Pending appts', value: pendingAppts.toString(), note: 'Action required', tone: 'rose', symbol: '◷' },
      { label: "Today's revenue", value: '$4,850', note: 'Estimated daily total', tone: 'mint', symbol: '$' },
    ]

    const recentActivity = [
      { text: 'System backup completed successfully.', time: 'Just now', tone: 'slate' },
      { text: `Live sync: ${totalPatients} patient records available in MongoDB.`, time: '10 mins ago', tone: 'teal' },
      { text: `${todaysAppts} appointments scheduled for today.`, time: '30 mins ago', tone: 'blue' },
    ]

    res.status(200).json({
      success: true,
      data: {
        stats,
        upcomingAppointments,
        recentActivity,
      },
    })
  } catch (error) {
    next(error)
  }
}
