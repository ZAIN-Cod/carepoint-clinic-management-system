// Temporary presentation data for Phase 2. Replace these exports with services/API data in Phase 6.
export const dashboardStats = [
  { label: 'Total patients', value: '1,284', note: '+12% vs last month', tone: 'teal', symbol: '◌' },
  { label: "Today's appts", value: '42', note: '5 pending', tone: 'blue', symbol: '▣' },
  { label: 'Available doctors', value: '18', note: 'active now', tone: 'cyan', symbol: '+' },
  { label: 'Pending appts', value: '12', note: 'Action required', tone: 'rose', symbol: '◷' },
  { label: "Today's revenue", value: '$4,850', note: '+5% vs yesterday', tone: 'mint', symbol: '$' },
]

export const dashboardAppointments = [
  { initials: 'SJ', patient: 'Sarah Jenkins', detail: 'General Checkup · Dr. Smith', time: '10:30 AM', status: 'Confirmed' },
  { initials: 'MR', patient: 'Michael Rodriguez', detail: 'Cardiology Consult · Dr. Lee', time: '11:15 AM', status: 'Pending' },
  { initials: 'AP', patient: 'Arthur Pendleton', detail: 'Orthopedics · Dr. Patel', time: '1:00 PM', status: 'Confirmed' },
]

export const recentActivity = [
  { text: 'Dr. Smith completed notes for Patient #492.', time: '10 mins ago', tone: 'teal' },
  { text: 'New appointment requested via Web Portal.', time: '32 mins ago', tone: 'blue' },
  { text: 'Lab results for Sarah Jenkins are ready.', time: '1 hour ago', tone: 'red' },
  { text: 'System backup completed successfully.', time: '3 hours ago', tone: 'slate' },
]

export const scheduledAppointments = [
  { time: '09:30 AM', initials: 'EV', patient: 'Eleanor Vance', doctor: 'Dr. Sarah Jenkins', department: 'Cardiology', status: 'Confirmed' },
  { time: '09:30 AM', initials: 'AP', patient: 'Arthur Pendleton', doctor: 'Dr. Robert Chen', department: 'General Practice', status: 'Pending' },
  { time: '11:00 AM', initials: 'MR', patient: 'Marcus Rivera', doctor: 'Dr. Emily Stanton', department: 'Dental', status: 'Completed' },
]

export const services = [
  { id: 'checkup', name: 'General Checkup', fullName: 'General Checkup & Cleaning', price: 150, description: 'Comprehensive exam, x-rays, and professional cleaning.' },
  { id: 'whitening', name: 'Teeth Whitening', price: 299, description: 'Professional in-office whitening session for a brighter smile.' },
  { id: 'emergency', name: 'Emergency Care', price: 199, description: 'Immediate attention for pain, trauma, or broken teeth.' },
  { id: 'consultation', name: 'Cosmetic Consultation', price: 0, description: 'Discuss veneers, invisalign, or smile makeovers.' },
]

export const doctors = [
  { id: 'jenkins', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', initials: 'SJ' },
  { id: 'chen', name: 'Dr. Robert Chen', specialty: 'General Practice', initials: 'RC' },
  { id: 'stanton', name: 'Dr. Emily Stanton', specialty: 'Dental', initials: 'ES' },
]

export const patientRecord = {
  id: '#DF-8842-91A',
  name: 'Eleanor Shellstrop',
  dateOfBirth: 'Oct 14, 1982',
  procedures: [
    { name: 'Routine Prophylaxis & Scaling', detail: 'Nov 12, 2023 · Hygienist Sarah Jenkins' },
    { name: 'Composite Filling (Tooth #14)', detail: 'Sep 05, 2023 · Dr. Aris Thorne' },
  ],
  prescriptions: [
    { name: 'Amoxicillin', detail: '500mg · Take 1 capsule every 8 hours for 7 days', refills: '0' },
    { name: 'Chlorhexidine', detail: '0.12% Oral Rinse · Use twice daily after brushing', refills: '2' },
  ],
}
