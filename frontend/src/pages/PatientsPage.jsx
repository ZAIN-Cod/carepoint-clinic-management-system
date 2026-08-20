import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionCard from '../components/SectionCard.jsx'
import { patientService } from '../services/patientService.js'

function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '1990-01-01',
    gender: 'Female',
    address: '',
    medicalNotes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadPatients(searchTerm = search) {
    try {
      setIsLoading(true)
      setError(null)
      const res = await patientService.getPatients(searchTerm)
      if (res.success && res.data) {
        setPatients(res.data)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch patients.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  function handleSearchSubmit(e) {
    e.preventDefault()
    loadPatients(search)
  }

  async function handleAddPatientSubmit(e) {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await patientService.createPatient(formData)
      if (res.success) {
        setShowAddForm(false)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '1990-01-01',
          gender: 'Female',
          address: '',
          medicalNotes: '',
        })
        await loadPatients()
      }
    } catch (err) {
      alert(`Error creating patient: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id, name) {
    if (window.confirm(`Are you sure you want to delete patient ${name}?`)) {
      try {
        await patientService.deletePatient(id)
        await loadPatients()
      } catch (err) {
        alert(`Failed to delete patient: ${err.message}`)
      }
    }
  }

  return (
    <div className="patients-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'black' }}>Patient Directory</h1>
          <p style={{ color: '#9ca3af' }}>Search, manage, and view comprehensive patient records in CarePoint Clinic database.</p>
        </div>
        <button
          className="dark-action"
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? '✕ Close Form' : '⊕ Register New Patient'}
        </button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <SectionCard title="Register New Patient">
          <form onSubmit={handleAddPatientSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              First Name *
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              Last Name *
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              Phone Number *
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              Email Address
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              Date of Birth *
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              Gender
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="button button--secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Patient Record'}</button>
            </div>
          </form>
        </SectionCard>
      )}

      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="search"
          placeholder="Search patients by name, code, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
        />
        <button className="dark-action" type="submit">Search</button>
      </form>

      {isLoading ? (
        <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.8, color: '#9ca3af' }}>Loading patients...</p>
      ) : patients.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
          <h3 style={{ color: '#ffffff' }}>No Patients Found</h3>
          <p style={{ color: 'var(--color-text-muted, #9ca3af)', marginTop: '0.5rem' }}>No patient records match your search or exist in the database.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border, #1f2937)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: '#9ca3af' }}>Patient Code</th>
                <th style={{ padding: '1rem', color: '#9ca3af' }}>Name</th>
                <th style={{ padding: '1rem', color: '#9ca3af' }}>Phone</th>
                <th style={{ padding: '1rem', color: '#9ca3af' }}>Email</th>
                <th style={{ padding: '1rem', color: '#9ca3af' }}>Date of Birth</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#9ca3af' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border, #1f2937)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>{p.patientCode || p._id.slice(-6)}</td>
                  <td style={{ padding: '1rem', color: '#ffffff' }}>{p.firstName} {p.lastName}</td>
                  <td style={{ padding: '1rem', color: '#ffffff' }}>{p.phone}</td>
                  <td style={{ padding: '1rem', color: '#ffffff' }}>{p.email || 'N/A'}</td>
                  <td style={{ padding: '1rem', color: '#ffffff' }}>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <Link className="card-link" to={`/patients/${p._id}`}>View Record</Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id, `${p.firstName} ${p.lastName}`)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PatientsPage