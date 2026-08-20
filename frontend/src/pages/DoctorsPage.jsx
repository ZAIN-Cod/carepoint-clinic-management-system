import { useEffect, useState } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { doctorService } from '../services/doctorService.js'

const specializations = ['All', 'Cardiology', 'General Practice', 'Dental', 'Orthopedics']

function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [activeSpecialization, setActiveSpecialization] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: 'General Practice',
    status: 'Active',
    initials: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadDoctors() {
    try {
      setIsLoading(true)
      setError(null)
      const res = await doctorService.getDoctors({
        specialization: activeSpecialization,
        search,
      })
      if (res.success && res.data) {
        setDoctors(res.data)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors directory.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [activeSpecialization])

  function handleSearchSubmit(e) {
    e.preventDefault()
    loadDoctors()
  }

  async function handleAddDoctorSubmit(e) {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await doctorService.createDoctor(formData)
      if (res.success) {
        setShowAddForm(false)
        setFormData({
          name: '',
          email: '',
          specialization: 'General Practice',
          status: 'Active',
          initials: '',
        })
        await loadDoctors()
      }
    } catch (err) {
      alert(`Error creating doctor profile: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="doctors-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Clinic Directory &amp; Doctors</h1>
          <p>Browse CarePoint medical specialists, monitor clinical availability, and manage doctor profiles.</p>
        </div>
        <button className="dark-action" type="button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? '✕ Close Form' : '⊕ Add New Doctor'}
        </button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <SectionCard title="Register New Doctor">
          <form onSubmit={handleAddDoctorSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Full Name *
              <input
                type="text"
                required
                placeholder="Dr. Alexander Wright"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Email Address *
              <input
                type="email"
                required
                placeholder="a.wright@carepoint.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Specialization *
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              >
                <option value="General Practice">General Practice</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dental">Dental</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Status
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="button button--secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Doctor Profile'}</button>
            </div>
          </form>
        </SectionCard>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <input
            type="search"
            placeholder="Search doctors by name, specialization, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
          />
          <button className="dark-action" type="submit">Search</button>
        </form>

        <div className="filter-chips" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {specializations.map((spec) => (
            <button
              className={activeSpecialization === spec ? 'is-active' : ''}
              type="button"
              key={spec}
              onClick={() => setActiveSpecialization(spec)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '20px',
                border: '1px solid var(--color-border, #1f2937)',
                background: activeSpecialization === spec ? 'var(--color-teal, #0d9488)' : 'var(--color-surface, #111827)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.8 }}>Loading medical staff directory...</p>
      ) : doctors.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
          <h3>No Doctors Found</h3>
          <p style={{ color: 'var(--color-text-muted, #9ca3af)', marginTop: '0.5rem' }}>No doctors match your selected specialization or search criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {doctors.map((doc) => {
            const initials = doc.initials || doc.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            return (
              <article
                key={doc._id}
                style={{
                  background: 'var(--color-surface, #111827)',
                  border: '1px solid var(--color-border, #1f2937)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="initial-avatar initial-avatar--large" style={{ fontSize: '1.2rem' }}>{initials}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{doc.name}</h3>
                    <p style={{ margin: '0.2rem 0 0 0', color: 'var(--color-teal-light, #2dd4bf)', fontSize: '0.875rem' }}>{doc.specialization}</p>
                  </div>
                  <StatusBadge status={doc.status === 'Active' ? 'Confirmed' : 'Pending'} />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #9ca3af)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span>✉ {doc.email}</span>
                  <span>▣ CarePoint Medical Staff ID: {doc._id.slice(-6).toUpperCase()}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button className="button button--secondary" type="button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>View Profile</button>
                  <button className="dark-action" type="button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}>Schedule</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DoctorsPage
