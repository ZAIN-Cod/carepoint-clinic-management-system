import { useEffect, useState } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import { reportsService } from '../services/reportsService.js'

function ReportsPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiReportContent, setAiReportContent] = useState('')
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true)
        setError(null)
        const res = await reportsService.getAnalytics()
        if (res.success && res.data) {
          setData(res.data)
        }
      } catch (err) {
        setError(err.message || 'Failed to load clinic reports analytics.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  function handleGenerateAiReport() {
    setShowAiModal(true)
    setIsGeneratingAi(true)
    setAiReportContent('')

    setTimeout(() => {
      setIsGeneratingAi(false)
      setAiReportContent(`CarePoint Predictive Executive Summary (${new Date().toLocaleDateString()})

1. Patient Growth & Retention: Patient registrations increased by +14% month-over-month. High retention observed in Cardiology follow-ups.
2. Resource Optimization: General Practice operate at 84% capacity during morning peak hours (09:00 AM - 12:00 PM).
3. Revenue Optimization: Total quarterly revenue reached $82,450. Dental hygiene procedures yielded the highest margin per visit.
4. Recommendations: Expand evening appointment slots in General Practice to capture unserved weekend demand.`)
    }, 1500)
  }

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.8 }}>
        <p>Calculating live clinic analytics &amp; reporting trends...</p>
      </div>
    )
  }

  const summary = data?.summary || {
    totalPatients: 0,
    totalAppointments: 0,
    activeClinicians: 0,
    totalRevenue: 0,
    occupancyRate: '84%',
  }
  const departmentStats = data?.departmentStats || []
  const monthlyRevenue = data?.monthlyRevenue || []

  const statsList = [
    { label: 'Total Patients Registered', value: summary.totalPatients.toString(), note: 'Active health records', tone: 'teal', symbol: '◌' },
    { label: 'Scheduled Appointments', value: summary.totalAppointments.toString(), note: 'Recorded visits', tone: 'blue', symbol: '▣' },
    { label: 'Active Specialists', value: summary.activeClinicians.toString(), note: 'On-duty doctors', tone: 'cyan', symbol: '+' },
    { label: 'Gross Revenue', value: `$${summary.totalRevenue.toLocaleString()}`, note: 'Settled payments', tone: 'mint', symbol: '$' },
  ]

  return (
    <div className="reports-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Clinic Insights &amp; Analytics Reports</h1>
          <p>Analyze patient volume, revenue performance, department occupancy, and executive metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="dark-action" type="button" onClick={handleGenerateAiReport}>
            ✦ Generate AI Report
          </button>
          <button className="button button--secondary" type="button" onClick={() => alert('Exporting Analytics Data to CSV format...')}>
            ⇩ Export CSV
          </button>
        </div>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
          {error}
        </div>
      )}

      <div className="stats-grid">
        {statsList.map((stat) => <StatCard {...stat} key={stat.label} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <SectionCard title="Department Volume Distribution">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            {departmentStats.map((dept) => (
              <div key={dept.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  <span>{dept.name}</span>
                  <strong>{dept.count} visits ({dept.percentage}%)</strong>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--color-bg, #090d16)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${dept.percentage}%`,
                      background: dept.name === 'Cardiology' ? 'var(--color-teal, #0d9488)' : dept.name === 'Dental' ? '#3b82f6' : '#10b981',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Monthly Revenue Trajectory">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1.5rem', borderBottom: '1px solid var(--color-border, #1f2937)' }}>
            {monthlyRevenue.map((rev) => {
              const maxRev = 25000
              const heightPct = Math.round((rev.revenue / maxRev) * 100)
              return (
                <div key={rev.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #9ca3af)' }}>${(rev.revenue / 1000).toFixed(1)}k</span>
                  <div
                    style={{
                      width: '60%',
                      maxWidth: '36px',
                      height: `${heightPct}%`,
                      background: rev.month === 'Nov' ? 'var(--color-teal, #0d9488)' : 'rgba(13, 148, 136, 0.4)',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>{rev.month}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>

      {showAiModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>✦ AI Executive Analytics Report</h2>
              <button type="button" onClick={() => setShowAiModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {isGeneratingAi ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ animation: 'pulse 1.5s infinite' }}>Analyzing clinical datasets &amp; generating predictive insights...</p>
              </div>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: 'var(--color-bg, #090d16)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--color-border, #1f2937)', fontSize: '0.9rem', lineHeight: '1.6', color: '#e5e7eb' }}>
                {aiReportContent}
              </pre>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="button button--secondary" type="button" onClick={() => setShowAiModal(false)}>Close</button>
              {!isGeneratingAi && (
                <button className="dark-action" type="button" onClick={() => alert('AI Report exported to PDF.')}>Download PDF Report</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsPage
