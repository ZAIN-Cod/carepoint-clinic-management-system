export const primaryNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Appointments', to: '/appointments', icon: 'calendar' },
  { label: 'Patients', to: '/patients', icon: 'patients' },
  { label: 'Doctors', to: '/doctors', icon: 'doctor' },
  { label: 'Records', to: '/medical-records', icon: 'records' },
  { label: 'Prescriptions', to: '/prescriptions', icon: 'prescription' },
  { label: 'Billing', to: '/billing', icon: 'billing' },
  { label: 'Reports', to: '/reports', icon: 'reports' },
]

export const settingsNavigation = {
  label: 'Settings',
  to: '/settings',
  icon: 'settings',
}

export const pageDetails = {
  '/dashboard': { eyebrow: 'Clinic overview', title: 'Dashboard' },
  '/appointments': { eyebrow: 'Appointment workflow', title: 'Appointments' },
  '/appointments/new': { eyebrow: 'Appointment workflow', title: 'Book appointment' },
  '/patients': { eyebrow: 'Patient management', title: 'Patients' },
  '/doctors': { eyebrow: 'Clinic directory', title: 'Doctors' },
  '/medical-records': { eyebrow: 'Clinical information', title: 'Medical records' },
  '/prescriptions': { eyebrow: 'Clinical information', title: 'Prescriptions' },
  '/billing': { eyebrow: 'Financial operations', title: 'Billing' },
  '/reports': { eyebrow: 'Clinic insights', title: 'Reports' },
  '/settings': { eyebrow: 'Clinic configuration', title: 'Settings' },
}
