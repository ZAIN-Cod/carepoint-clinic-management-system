import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { dashboardService } from '../services/dashboardService.js'

function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true)
        setError(null)
        const res = await dashboardService.getStats()
        if (res.success && res.data) {
          setStats(res.data.stats || [])
          setUpcomingAppointments(res.data.upcomingAppointments || [])
          setRecentActivity(res.data.recentActivity || [])
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const greetingName = user?.name ? user.name.split(' ')[0] : 'Admin'

  return (
    <div className="dashboard-page">
      <header className="page-intro dashboard-intro">
        <div>
          <h1>Good morning, {greetingName}</h1>
          <p>Here&apos;s what&apos;s happening at CarePoint Clinic today.</p>
        </div>
        <button className="dark-action" type="button">✦ Generate AI Report</button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.8 }}>
          <p>Loading clinic analytics...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat) => <StatCard {...stat} key={stat.label} />)}
          </div>

          <div className="dashboard-lower-grid">
            <SectionCard title="Upcoming Appointments" action={<Link className="card-link" to="/appointments">View all</Link>}>
              <div className="appointment-list">
                {upcomingAppointments.length === 0 ? (
                  <p style={{ padding: '1rem', color: 'var(--color-text-muted, #9ca3af)' }}>No upcoming appointments scheduled.</p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <article className="dashboard-appointment" key={appointment.id || appointment.patient}>
                      <span className="initial-avatar">{appointment.initials}</span>
                      <div>
                        <h3>{appointment.patient}</h3>
                        <p>{appointment.detail}</p>
                      </div>
                      <div className="appointment-time">
                        <strong>{appointment.time}</strong>
                        <StatusBadge status={appointment.status} />
                      </div>
                    </article>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard title="Recent Activity" className="activity-card">
              <ol className="activity-list">
                {recentActivity.map((activity, idx) => (
                  <li className={`activity-item activity-item--${activity.tone}`} key={idx}>
                    <p>{activity.text}</p>
                    <time>{activity.time}</time>
                  </li>
                ))}
              </ol>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
