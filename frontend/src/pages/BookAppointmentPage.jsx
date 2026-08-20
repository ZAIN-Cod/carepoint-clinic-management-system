import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appointmentService } from '../services/appointmentService.js'
import { clinicianService } from '../services/clinicianService.js'
import { patientService } from '../services/patientService.js'
import { services } from '../utils/demoData.js'

function BookAppointmentPage() {
  const navigate = useNavigate()
  const [serviceId, setServiceId] = useState('checkup')
  const [doctorId, setDoctorId] = useState('')
  const [patientId, setPatientId] = useState('')
  const [date, setDate] = useState('2026-08-24')
  const [time, setTime] = useState('09:30')
  const [notes, setNotes] = useState('')

  const [doctorsList, setDoctorsList] = useState([])
  const [patientsList, setPatientsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [cliniciansRes, patientsRes] = await Promise.all([
          clinicianService.getClinicians(),
          patientService.getPatients(),
        ])

        if (cliniciansRes.success && cliniciansRes.data) {
          setDoctorsList(cliniciansRes.data)
          if (cliniciansRes.data.length > 0) {
            setDoctorId(cliniciansRes.data[0]._id)
          }
        }

        if (patientsRes.success && patientsRes.data) {
          setPatientsList(patientsRes.data)
          if (patientsRes.data.length > 0) {
            setPatientId(patientsRes.data[0]._id)
          }
        }
      } catch (err) {
        setErrorMessage('Failed to load clinicians or patients from server.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const selectedService = services.find((service) => service.id === serviceId) || services[0]
  const selectedDoctor = doctorsList.find((doc) => doc._id === doctorId)
  const selectedPatient = patientsList.find((p) => p._id === patientId)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    if (!date || !time) {
      setErrorMessage('Please select a valid date and time.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const payload = {
        patientId,
        clinicianId: doctorId,
        service: selectedService.name,
        date,
        time,
        notes,
        department: selectedDoctor ? selectedDoctor.specialization : 'General Practice',
        status: 'Scheduled',
      }

      const res = await appointmentService.createAppointment(payload)
      if (res.success) {
        navigate('/appointments', { replace: true })
      } else {
        setErrorMessage(res.message || 'Failed to book appointment.')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving appointment to database.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.8 }}>
        <p>Loading booking parameters...</p>
      </div>
    )
  }

  return (
    <form className="booking-page" onSubmit={handleSubmit}>
      <header className="page-intro booking-intro">
        <div>
          <h1>Book appointment</h1>
          <p>Schedule a patient visit with the right CarePoint specialist.</p>
        </div>
        <ol className="booking-steps">
          <li className="is-current">1<span>Service</span></li>
          <li className={doctorId ? 'is-current' : ''}>2<span>Clinician</span></li>
          <li className={date && time ? 'is-current' : ''}>3<span>Time</span></li>
        </ol>
      </header>

      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', marginBottom: '1.5rem' }}>
          {errorMessage}
        </div>
      )}

      <div className="booking-layout">
        <div className="booking-content">
          {patientsList.length > 0 && (
            <section className="booking-section">
              <h2>Select patient</h2>
              <div className="booking-inputs">
                <label>
                  Patient Record
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'var(--color-surface, #111827)',
                      color: '#fff',
                      border: '1px solid var(--color-border, #1f2937)',
                      marginTop: '0.5rem',
                    }}
                  >
                    {patientsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.firstName} {p.lastName} ({p.patientCode || p.phone})
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          )}

          <section className="booking-section">
            <h2>Select service</h2>
            <div className="service-grid">
              {services.map((service) => (
                <label className={`service-option${service.id === serviceId ? ' is-selected' : ''}`} key={service.id}>
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={service.id === serviceId}
                    onChange={() => setServiceId(service.id)}
                  />
                  <span className="service-option__symbol">✦</span>
                  <span>
                    <b>{service.fullName ?? service.name}</b>
                    <small>{service.description}</small>
                  </span>
                  <strong>{service.price === 0 ? 'Free' : service.id === 'emergency' ? 'From $199' : `$${service.price}`}</strong>
                </label>
              ))}
            </div>
          </section>

          <section className="booking-section">
            <h2>Choose clinician</h2>
            <div className="doctor-options">
              {doctorsList.map((doctor) => {
                const docInitials = doctor.initials || doctor.name.split(' ').map((n) => n[0]).join('')
                return (
                  <label className={`doctor-option${doctor._id === doctorId ? ' is-selected' : ''}`} key={doctor._id}>
                    <input
                      type="radio"
                      name="doctor"
                      value={doctor._id}
                      checked={doctor._id === doctorId}
                      onChange={() => setDoctorId(doctor._id)}
                    />
                    <span className="initial-avatar initial-avatar--large">{docInitials}</span>
                    <b>{doctor.name}</b>
                    <small>{doctor.specialization}</small>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="booking-section booking-section--time">
            <h2>Select date &amp; time</h2>
            <div className="booking-inputs">
              <label>
                Date
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
              </label>
              <label>
                Time
                <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
              </label>
              <label className="booking-notes">
                Appointment notes
                <textarea
                  placeholder="Optional notes for the clinician"
                  rows="4"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="booking-summary">
          <h2>Appointment summary</h2>
          <dl>
            <div>
              <dt>Patient</dt>
              <dd>{selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'CarePoint Patient'}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd>
                {selectedService.name}
                <strong>${selectedService.price}</strong>
              </dd>
            </div>
            <div>
              <dt>Clinician</dt>
              <dd>{selectedDoctor ? selectedDoctor.name : 'Pending selection'}</dd>
            </div>
            <div>
              <dt>Date &amp; time</dt>
              <dd>{date} · {time}</dd>
            </div>
          </dl>
          <div className="booking-total">
            <span>Estimated total</span>
            <strong>${selectedService.price}</strong>
          </div>
          <button className="primary-action" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving to Database...' : 'Confirm & Save Appointment →'}
          </button>
          <p className="secure-booking">
            ▣ Secure booking<br />
            <span>Connected live to CarePoint MongoDB database layer.</span>
          </p>
        </aside>
      </div>
    </form>
  )
}

export default BookAppointmentPage
