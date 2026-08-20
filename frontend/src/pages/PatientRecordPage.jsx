import { useEffect, useState } from 'react'
import { useParams } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import { patientService } from '../services/patientService.js'

function PatientRecordPage() {
  const { patientId } = useParams()
  const [patient, setPatient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPatient() {
      try {
        setIsLoading(true)
        setError(null)

        // Check if patientId is valid 24-character MongoDB ObjectId
        const isValidObjectId = patientId && /^[0-9a-fA-F]{24}$/.test(patientId)

        if (isValidObjectId) {
          const res = await patientService.getPatientById(patientId)
          if (res.success && res.data) {
            setPatient(res.data)
            return
          }
        }

        // Fallback: load first patient from patient list
        const listRes = await patientService.getPatients()
        if (listRes.success && listRes.data && listRes.data.length > 0) {
          setPatient(listRes.data[0])
        } else {
          setError('No patient records found in database.')
        }
      } catch (err) {
        setError(err.message || 'Failed to load patient record.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPatient()
  }, [patientId])

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.8 }}>
        <p>Loading patient record...</p>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#f87171' }}>Patient Record Error</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted, #9ca3af)' }}>{error || 'Patient not found'}</p>
      </div>
    )
  }

  const fullName = `${patient.firstName} ${patient.lastName}`
  const dobFormatted = patient.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A'

  const procedures = [
    { name: 'Routine Prophylaxis & Scaling', detail: 'Nov 12, 2023 · Hygienist Sarah Jenkins' },
    { name: 'Composite Filling (Tooth #14)', detail: 'Sep 05, 2023 · Dr. Aris Thorne' },
  ]

  const prescriptions = [
    { name: 'Amoxicillin', detail: '500mg · Take 1 capsule every 8 hours for 7 days', refills: '0' },
    { name: 'Chlorhexidine', detail: '0.12% Oral Rinse · Use twice daily after brushing', refills: '2' },
  ]

  return (
    <div className="patient-record-page">
      <header className="patient-header">
        <div>
          <p>Secure patient record</p>
          <h1>{fullName}</h1>
          <ul>
            <li>ID: {patient.patientCode || patient._id}</li>
            <li>DOB: {dobFormatted}</li>
            <li>Phone: {patient.phone}</li>
            <li>Status: <b>Active</b></li>
          </ul>
        </div>
        <button className="light-action" type="button">⇩ Download PDF record</button>
      </header>

      {patient.medicalNotes && (
        <div style={{ padding: '1rem', background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <strong style={{ color: 'var(--color-teal-light, #2dd4bf)' }}>Clinical & Medical Notes:</strong> {patient.medicalNotes}
        </div>
      )}

      <div className="patient-layout">
        <div className="patient-main-column">
          <SectionCard title="Clinical History & Imaging" className="clinical-card">
            <p className="section-description">Comprehensive charting and radiographic records</p>
            <div className="imaging-grid">
              <div className="xray-visual xray-visual--large">
                <span>Clinical imaging</span>
                <b>⌁</b>
              </div>
              <div className="imaging-stack">
                <div className="xray-visual">
                  <b>◍</b>
                </div>
                <div className="restorations-count">
                  <strong>4</strong>
                  <span>Restorations monitored</span>
                </div>
              </div>
            </div>
            <p className="record-subheading">Recent procedures</p>
            <div className="procedure-list">
              {procedures.map((procedure) => (
                <article key={procedure.name}>
                  <span>✦</span>
                  <div>
                    <b>{procedure.name}</b>
                    <p>{procedure.detail}</p>
                  </div>
                  <strong>Completed</strong>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Active Prescriptions" className="prescriptions-card">
            <div className="prescription-grid">
              {prescriptions.map((prescription, index) => (
                <article className={index === 0 ? 'prescription prescription--primary' : 'prescription'} key={prescription.name}>
                  <h3>{prescription.name}</h3>
                  <p>{prescription.detail}</p>
                  <small>Refills: {prescription.refills}</small>
                  {index > 0 && <button className="light-action" type="button">Request refill</button>}
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <aside className="patient-side-column">
          <SectionCard title="Next Visit" className="next-visit-card">
            <p>Tomorrow</p>
            <strong>09:30 AM</strong>
            <span>♙ Dr. Aris Thorne</span>
            <span>▣ Crown preparation</span>
            <div>
              <button className="primary-action" type="button">Check-in</button>
              <button className="round-action" type="button" aria-label="Reschedule appointment">↗</button>
            </div>
          </SectionCard>

          <SectionCard title="Billing" className="billing-card">
            <div className="amount-due">
              <p>Amount due</p>
              <strong>$145.00</strong>
              <span>△ Due by Dec 15, 2023</span>
              <button type="button">Pay balance →</button>
            </div>
            <p className="record-subheading">6-month spending history</p>
            <div className="spending-chart" aria-label="Six month spending history">
              <span style={{ height: '35%' }}>Jul</span>
              <span style={{ height: '72%' }}>Aug</span>
              <span style={{ height: '26%' }}>Sep</span>
              <span style={{ height: '52%' }}>Oct</span>
              <span className="is-current" style={{ height: '92%' }}>Nov</span>
              <span style={{ height: '25%' }}>Dec</span>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  )
}

export default PatientRecordPage
