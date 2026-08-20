import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge.jsx'
import { appointmentService } from '../services/appointmentService.js'

const departments = ['All', 'General', 'Cardiology', 'Dental']
const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled']

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [activeDepartment, setActiveDepartment] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')
  const [view, setView] = useState('Week')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadAppointments() {
    try {
      setIsLoading(true)
      setError(null)
      const res = await appointmentService.getAppointments({
        department: activeDepartment,
        status: activeStatus,
      })
      if (res.success && res.data) {
        setAppointments(res.data)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [activeDepartment, activeStatus])

  async function handleDelete(id, patientName) {
    if (window.confirm(`Are you sure you want to cancel/delete the appointment for ${patientName}?`)) {
      try {
        await appointmentService.deleteAppointment(id)
        await loadAppointments()
      } catch (err) {
        alert(`Failed to delete appointment: ${err.message}`)
      }
    }
  }

  return (
    <div className="appointments-page">
      <header className="page-intro schedule-intro">
        <div>
          <h1>Schedule</h1>
          <p>Manage daily appointments, monitor patient flow, and optimize clinic resources across all departments.</p>
        </div>
        <div className="schedule-intro__actions">
          <div className="view-switcher">
            {['Day', 'Week', 'Month'].map((option) => (
              <button className={view === option ? 'is-selected' : ''} key={option} type="button" onClick={() => setView(option)}>
                {option}
              </button>
            ))}
          </div>
          <Link className="dark-action" to="/appointments/new">⊕ New appointment</Link>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="schedule-layout">
        <aside className="schedule-sidebar">
          <section className="schedule-overview">
            <p>Today&apos;s overview</p>
            <h2>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</h2>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}, {appointments.length} Appointments</span>
            <div className="capacity-card">
              <strong>65%</strong>
              <div>
                <b>Capacity<br />Normal</b>
                <p>Available slots remaining across all active departments.</p>
              </div>
            </div>
          </section>

          <section className="filters-card">
            <header>
              <h2>Filters</h2>
              <button type="button" onClick={() => { setActiveDepartment('All'); setActiveStatus('All') }}>
                Reset all
              </button>
            </header>

            <p>Department</p>
            <div className="filter-chips">
              {departments.map((department) => (
                <button
                  className={activeDepartment === department ? 'is-active' : ''}
                  type="button"
                  key={department}
                  onClick={() => setActiveDepartment(department)}
                >
                  {department}
                </button>
              ))}
            </div>

            <p>Status</p>
            <div className="filter-chips" style={{ marginTop: '0.5rem' }}>
              {statuses.map((status) => (
                <button
                  className={activeStatus === status ? 'is-active' : ''}
                  type="button"
                  key={status}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="appointment-timeline" aria-label={`${view} appointment schedule`}>
          {isLoading ? (
            <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.8 }}>Loading appointments schedule...</p>
          ) : appointments.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
              <h3>No Appointments Found</h3>
              <p style={{ color: 'var(--color-text-muted, #9ca3af)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>There are no appointments matching your selected filter criteria.</p>
              <Link className="dark-action" to="/appointments/new">⊕ Book First Appointment</Link>
            </div>
          ) : (
            appointments.map((appointment) => {
              const patientName = appointment.patient
                ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                : 'Registered Patient'
              const clinicianName = appointment.clinician ? appointment.clinician.name : 'CarePoint Specialist'
              const departmentName = appointment.department || (appointment.clinician ? appointment.clinician.specialization : 'General')
              const patientInitials = appointment.patient
                ? `${appointment.patient.firstName.charAt(0)}${appointment.patient.lastName.charAt(0)}`
                : 'AP'

              const timeParts = (appointment.time || '09:30 AM').split(' ')
              const mainTime = timeParts[0]
              const ampm = timeParts[1] || ''
              const patientId = appointment.patient?._id || appointment.patient

              return (
                <article className="timeline-row" key={appointment._id}>
                  <time>
                    {mainTime}
                    <small>{ampm}</small>
                  </time>
                  <div className={`timeline-appointment timeline-appointment--${(appointment.status || 'scheduled').toLowerCase()}`}>
                    <span className="initial-avatar initial-avatar--large">{patientInitials}</span>
                    <div className="timeline-appointment__details">
                      <h2>
                        {patientId ? (
                          <Link to={`/patients/${patientId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {patientName}
                          </Link>
                        ) : (
                          patientName
                        )}
                      </h2>
                      <p>
                        {clinicianName} <span>•</span> {departmentName}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                    <div className="appointment-actions">
                      <button
                        type="button"
                        onClick={() => handleDelete(appointment._id, patientName)}
                        style={{ color: '#f87171', fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </section>
      </div>
    </div>
  )
}

export default AppointmentsPage
