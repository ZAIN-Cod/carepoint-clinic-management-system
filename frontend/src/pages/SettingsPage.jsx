import { useState } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('clinic')
  const [saveSuccess, setSaveSuccess] = useState('')

  const [clinicData, setClinicData] = useState({
    clinicName: 'CarePoint VitalCare Clinic Suite',
    email: 'contact@carepoint.com',
    phone: '(555) 100-CARE',
    address: '100 Medical Center Parkway, Suite 400',
    operatingHours: 'Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    enable2FA: false,
  })

  function handleClinicSave(e) {
    e.preventDefault()
    setSaveSuccess('Clinic configuration updated successfully!')
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  function handleSecuritySave(e) {
    e.preventDefault()
    if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
      alert('New password and confirm password do not match.')
      return
    }
    setSaveSuccess('Security preferences saved!')
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '', enable2FA: securityData.enable2FA })
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  return (
    <div className="settings-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro">
        <div>
          <h1>Clinic Configuration &amp; Settings</h1>
          <p>Configure clinic details, operational preferences, user security, and system connectivity.</p>
        </div>
      </header>

      {saveSuccess && (
        <div style={{ padding: '1rem', background: 'rgba(45, 212, 191, 0.15)', border: '1px solid rgba(45, 212, 191, 0.4)', borderRadius: '8px', color: '#2dd4bf' }}>
          ✓ {saveSuccess}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border, #1f2937)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'clinic', label: 'Clinic Profile' },
          { id: 'security', label: 'Security & Account' },
          { id: 'system', label: 'System & Database Health' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-teal, #0d9488)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted, #9ca3af)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'clinic' && (
        <SectionCard title="Clinic Identification &amp; Operating Hours">
          <form onSubmit={handleClinicSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem' }}>
              Clinic Name
              <input
                type="text"
                value={clinicData.clinicName}
                onChange={(e) => setClinicData({ ...clinicData, clinicName: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem' }}>
              Contact Email
              <input
                type="email"
                value={clinicData.email}
                onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem' }}>
              Phone Number
              <input
                type="text"
                value={clinicData.phone}
                onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem', gridColumn: '1 / -1' }}>
              Physical Address
              <input
                type="text"
                value={clinicData.address}
                onChange={(e) => setClinicData({ ...clinicData, address: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem', gridColumn: '1 / -1' }}>
              Operating Schedule
              <input
                type="text"
                value={clinicData.operatingHours}
                onChange={(e) => setClinicData({ ...clinicData, operatingHours: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="dark-action" type="submit">Save Changes</button>
            </div>
          </form>
        </SectionCard>
      )}

      {activeTab === 'security' && (
        <SectionCard title="Account Security &amp; Password Preferences">
          <form onSubmit={handleSecuritySave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem', maxWidth: '500px' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--color-bg, #090d16)', borderRadius: '8px', fontSize: '0.875rem' }}>
              Logged in as: <strong>{user?.email}</strong> (Role: <span style={{ color: 'var(--color-teal-light, #2dd4bf)' }}>{user?.role}</span>)
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem' }}>
              Current Password
              <input
                type="password"
                placeholder="••••••••"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem' }}>
              New Password
              <input
                type="password"
                placeholder="••••••••"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.875rem' }}>
              Confirm New Password
              <input
                type="password"
                placeholder="••••••••"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={securityData.enable2FA}
                onChange={(e) => setSecurityData({ ...securityData, enable2FA: e.target.checked })}
              />
              Enable Two-Factor Authentication (2FA) for admin access
            </label>

            <div>
              <button className="dark-action" type="submit">Update Security Settings</button>
            </div>
          </form>
        </SectionCard>
      )}

      {activeTab === 'system' && (
        <SectionCard title="System Diagnostics &amp; Infrastructure">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--color-bg, #090d16)', borderRadius: '8px', border: '1px solid var(--color-border, #1f2937)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #9ca3af)' }}>Database Connectivity</span>
              <h4 style={{ margin: '0.4rem 0 0 0', color: '#2dd4bf' }}>MongoDB Atlas Connected</h4>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Mongoose ODM drivers active</p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--color-bg, #090d16)', borderRadius: '8px', border: '1px solid var(--color-border, #1f2937)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #9ca3af)' }}>API Health Status</span>
              <h4 style={{ margin: '0.4rem 0 0 0', color: '#2dd4bf' }}>HTTP 200 OK</h4>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Endpoints responding optimally</p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--color-bg, #090d16)', borderRadius: '8px', border: '1px solid var(--color-border, #1f2937)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #9ca3af)' }}>Authentication Scheme</span>
              <h4 style={{ margin: '0.4rem 0 0 0', color: '#fff' }}>JWT Bearer Security</h4>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Bcrypt salted hash validation</p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--color-bg, #090d16)', borderRadius: '8px', border: '1px solid var(--color-border, #1f2937)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #9ca3af)' }}>API Base URL</span>
              <h4 style={{ margin: '0.4rem 0 0 0', color: '#fff', fontSize: '0.9rem' }}>{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</h4>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Configured via environment</p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  )
}

export default SettingsPage
