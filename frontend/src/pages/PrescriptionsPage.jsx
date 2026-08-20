import { useEffect, useState } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { doctorService } from '../services/doctorService.js'
import { patientService } from '../services/patientService.js'
import { prescriptionService } from '../services/prescriptionService.js'

function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([])
  const [activeStatus, setActiveStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [patientsList, setPatientsList] = useState([])
  const [doctorsList, setDoctorsList] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    clinicianId: '',
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    duration: '7 days',
    refills: 0,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadData() {
    try {
      setIsLoading(true)
      setError(null)
      const [rxRes, patRes, docRes] = await Promise.all([
        prescriptionService.getPrescriptions({ status: activeStatus, search }),
        patientService.getPatients(),
        doctorService.getDoctors(),
      ])

      if (rxRes.success && rxRes.data) {
        setPrescriptions(rxRes.data)
      }
      if (patRes.success && patRes.data) {
        setPatientsList(patRes.data)
        if (patRes.data.length > 0 && !formData.patientId) {
          setFormData((prev) => ({ ...prev, patientId: patRes.data[0]._id }))
        }
      }
      if (docRes.success && docRes.data) {
        setDoctorsList(docRes.data)
        if (docRes.data.length > 0 && !formData.clinicianId) {
          setFormData((prev) => ({ ...prev, clinicianId: docRes.data[0]._id }))
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [activeStatus])

  function handleSearchSubmit(e) {
    e.preventDefault()
    loadData()
  }

  async function handleAddPrescriptionSubmit(e) {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await prescriptionService.createPrescription(formData)
      if (res.success) {
        setShowAddForm(false)
        setFormData({
          patientId: patientsList[0]?._id || '',
          clinicianId: doctorsList[0]?._id || '',
          medicationName: '',
          dosage: '',
          frequency: 'Once daily',
          duration: '7 days',
          refills: 0,
          notes: '',
        })
        await loadData()
      }
    } catch (err) {
      alert(`Error prescribing medication: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRefill(id) {
    try {
      await prescriptionService.requestRefill(id)
      await loadData()
    } catch (err) {
      alert(`Failed to request refill: ${err.message}`)
    }
  }

  return (
    <div className="prescriptions-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Prescription Management</h1>
          <p>Issue, track, and process patient pharmaceutical prescriptions and refill authorizations.</p>
        </div>
        <button className="dark-action" type="button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? '✕ Close Form' : '⊕ Issue New Prescription'}
        </button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <SectionCard title="Issue New Prescription">
          <form onSubmit={handleAddPrescriptionSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
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
              Prescribing Doctor *
              <select
                value={formData.clinicianId}
                onChange={(e) => setFormData({ ...formData, clinicianId: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              >
                {doctorsList.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Medication Name *
              <input
                type="text"
                required
                placeholder="e.g. Amoxicillin or Lipitor"
                value={formData.medicationName}
                onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Dosage Strength *
              <input
                type="text"
                required
                placeholder="e.g. 500mg or 20mg"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Frequency *
              <input
                type="text"
                required
                placeholder="e.g. 1 capsule every 8 hours"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Refills Allowed
              <input
                type="number"
                min="0"
                max="12"
                value={formData.refills}
                onChange={(e) => setFormData({ ...formData, refills: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="button button--secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Issuing...' : 'Authorize & Issue Prescription'}</button>
            </div>
          </form>
        </SectionCard>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <input
            type="search"
            placeholder="Search prescriptions by medication name or dosage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
          />
          <button className="dark-action" type="submit">Search</button>
        </form>

        <div className="filter-chips" style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Active', 'Completed'].map((status) => (
            <button
              className={activeStatus === status ? 'is-active' : ''}
              type="button"
              key={status}
              onClick={() => setActiveStatus(status)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '20px',
                border: '1px solid var(--color-border, #1f2937)',
                background: activeStatus === status ? 'var(--color-teal, #0d9488)' : 'var(--color-surface, #111827)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.8 }}>Loading active prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
          <h3>No Prescriptions Found</h3>
          <p style={{ color: 'var(--color-text-muted, #9ca3af)', marginTop: '0.5rem' }}>No pharmaceutical prescriptions match your search filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {prescriptions.map((rx) => {
            const patientName = rx.patient ? `${rx.patient.firstName} ${rx.patient.lastName}` : 'Patient'
            const doctorName = rx.clinician ? rx.clinician.name : 'Prescribing Doctor'

            return (
              <article
                key={rx._id}
                style={{
                  background: 'var(--color-surface, #111827)',
                  border: '1px solid var(--color-border, #1f2937)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-teal-light, #2dd4bf)', fontWeight: 600 }}>Rx #{rx._id.slice(-6).toUpperCase()}</span>
                    <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.1rem' }}>{rx.medicationName}</h3>
                  </div>
                  <StatusBadge status={rx.status === 'Active' ? 'Confirmed' : 'Completed'} />
                </div>

                <div style={{ padding: '0.6rem 0.75rem', background: 'var(--color-bg, #090d16)', borderRadius: '6px', fontSize: '0.875rem' }}>
                  <strong>{rx.dosage}</strong> — {rx.frequency}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #9ca3af)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span>Patient: <strong>{patientName}</strong></span>
                  <span>Prescriber: {doctorName}</span>
                  <span>Refills Authorized: <strong>{rx.refills} remaining</strong></span>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="light-action" type="button" onClick={() => handleRefill(rx._id)}>
                    + Authorize Refill
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

export default PrescriptionsPage
