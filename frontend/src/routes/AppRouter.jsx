import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AppShell from '../layouts/AppShell.jsx'
import AppointmentsPage from '../pages/AppointmentsPage.jsx'
import BillingPage from '../pages/BillingPage.jsx'
import BookAppointmentPage from '../pages/BookAppointmentPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import DoctorsPage from '../pages/DoctorsPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import MedicalRecordsPage from '../pages/MedicalRecordsPage.jsx'
import PatientRecordPage from '../pages/PatientRecordPage.jsx'
import PatientsPage from '../pages/PatientsPage.jsx'
import PrescriptionsPage from '../pages/PrescriptionsPage.jsx'
import ReportsPage from '../pages/ReportsPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg, #090d16)', color: '#fff' }}>
        <p>Loading CarePoint Clinical Suite...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/new" element={<BookAppointmentPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:patientId" element={<PatientRecordPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
