import { useEffect, useState } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import { medicalRecordService } from '../services/medicalRecordService.js'
import { patientService } from '../services/patientService.js'

const recordTypes = ['All', 'Radiology', 'Lab Test', 'Procedure Note', 'Vaccination', 'Clinical Summary']

function MedicalRecordsPage() {
  const [records, setRecords] = useState([])
  const [activeType, setActiveType] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [patientsList, setPatientsList] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    recordType: 'Procedure Note',
    title: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadData() {
    try {
      setIsLoading(true)
      setError(null)
      const [recRes, patRes] = await Promise.all([
        medicalRecordService.getRecords({ recordType: activeType, search }),
        patientService.getPatients(),
      ])

      if (recRes.success && recRes.data) {
        setRecords(recRes.data)
      }
      if (patRes.success && patRes.data) {
        setPatientsList(patRes.data)
        if (patRes.data.length > 0 && !formData.patientId) {
          setFormData((prev) => ({ ...prev, patientId: patRes.data[0]._id }))
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load medical records.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [activeType])

  function handleSearchSubmit(e) {
    e.preventDefault()
    loadData()
  }

  async function handleAddRecordSubmit(e) {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await medicalRecordService.createRecord(formData)
      if (res.success) {
        setShowAddForm(false)
        setFormData({ patientId: patientsList[0]?._id || '', recordType: 'Procedure Note', title: '', notes: '' })
        await loadData()
      }
    } catch (err) {
      alert(`Error adding medical record: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="medical-records-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Electronic Health &amp; Medical Records</h1>
          <p>Access patient clinical charting, lab diagnostics, radiographic imaging, and procedure logs.</p>
        </div>
        <button className="dark-action" type="button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? '✕ Close Form' : '⊕ Add Clinical Record'}
        </button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <SectionCard title="Add Clinical Record">
          <form onSubmit={handleAddRecordSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Select Patient *
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              >
                {patientsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.lastName} ({p.patientCode || p.phone})
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Record Category *
              <select
                value={formData.recordType}
                onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              >
                {recordTypes.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', gridColumn: '1 / -1' }}>
              Record Title / Exam Name *
              <input
                type="text"
                required
                placeholder="e.g. Chest X-Ray 2-Views or Full Blood Count"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', gridColumn: '1 / -1' }}>
              Clinical Findings &amp; Diagnostics Notes
              <textarea
                rows="3"
                placeholder="Enter clinical observations, diagnostic findings, or pathology summary..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="button button--secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving Record...' : 'Save Medical Record'}</button>
            </div>
          </form>
        </SectionCard>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <input
            type="search"
            placeholder="Search medical records by title or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
          />
          <button className="dark-action" type="submit">Search</button>
        </form>

        <div className="filter-chips" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {recordTypes.map((type) => (
            <button
              className={activeType === type ? 'is-active' : ''}
              type="button"
              key={type}
              onClick={() => setActiveType(type)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '20px',
                border: '1px solid var(--color-border, #1f2937)',
                background: activeType === type ? 'var(--color-teal, #0d9488)' : 'var(--color-surface, #111827)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.8 }}>Loading medical records repository...</p>
      ) : records.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
          <h3>No Clinical Records Found</h3>
          <p style={{ color: 'var(--color-text-muted, #9ca3af)', marginTop: '0.5rem' }}>No medical charts or diagnostic records match your selected filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {records.map((record) => {
            const patientName = record.patient ? `${record.patient.firstName} ${record.patient.lastName}` : 'CarePoint Patient'
            const patientCode = record.patient?.patientCode || ''
            const clinicianName = record.clinician ? record.clinician.name : 'Attending Clinician'

            return (
              <article
                key={record._id}
                style={{
                  background: 'var(--color-surface, #111827)',
                  border: '1px solid var(--color-border, #1f2937)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', fontSize: '0.75rem', fontWeight: 600 }}>
                      {record.recordType}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #9ca3af)' }}>
                      {new Date(record.date || record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem' }}>{record.title}</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-muted, #9ca3af)', fontSize: '0.9rem' }}>
                    Patient: <strong>{patientName}</strong> {patientCode && `(${patientCode})`} <span>•</span> {clinicianName}
                  </p>
                  {record.notes && (
                    <p style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--color-bg, #090d16)', borderRadius: '6px', fontSize: '0.875rem', color: '#e5e7eb' }}>
                      {record.notes}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="light-action" type="button" onClick={() => alert(`Downloading record PDF for ${record.title}`)}>
                    ⇩ PDF Record
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MedicalRecordsPage
