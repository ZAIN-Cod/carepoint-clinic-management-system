import { useEffect, useState } from 'react'
import SectionCard from '../components/SectionCard.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { billingService } from '../services/billingService.js'
import { patientService } from '../services/patientService.js'

function BillingPage() {
  const [invoices, setInvoices] = useState([])
  const [metrics, setMetrics] = useState({ totalRevenue: 0, pendingAmount: 0, paidCount: 0, pendingCount: 0 })
  const [activeStatus, setActiveStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [patientsList, setPatientsList] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    service: 'General Checkup & Consultation',
    amount: '150',
    dueDate: '2026-09-15',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadData() {
    try {
      setIsLoading(true)
      setError(null)
      const [invRes, patRes] = await Promise.all([
        billingService.getInvoices({ status: activeStatus, search }),
        patientService.getPatients(),
      ])

      if (invRes.success && invRes.data) {
        setInvoices(invRes.data)
        setMetrics(invRes.metrics || { totalRevenue: 0, pendingAmount: 0, paidCount: 0, pendingCount: 0 })
      }
      if (patRes.success && patRes.data) {
        setPatientsList(patRes.data)
        if (patRes.data.length > 0 && !formData.patientId) {
          setFormData((prev) => ({ ...prev, patientId: patRes.data[0]._id }))
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load billing records.')
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

  async function handleAddInvoiceSubmit(e) {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await billingService.createInvoice(formData)
      if (res.success) {
        setShowAddForm(false)
        setFormData({
          patientId: patientsList[0]?._id || '',
          service: 'General Checkup & Consultation',
          amount: '150',
          dueDate: '2026-09-15',
          notes: '',
        })
        await loadData()
      }
    } catch (err) {
      alert(`Error creating invoice: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePay(id) {
    try {
      await billingService.markAsPaid(id)
      await loadData()
    } catch (err) {
      alert(`Failed to update invoice payment: ${err.message}`)
    }
  }

  const statCardsData = [
    { label: 'Total Revenue Paid', value: `$${metrics.totalRevenue.toLocaleString()}`, note: `${metrics.paidCount} settled invoices`, tone: 'teal', symbol: '$' },
    { label: 'Outstanding Balance', value: `$${metrics.pendingAmount.toLocaleString()}`, note: `${metrics.pendingCount} pending payment`, tone: 'rose', symbol: '△' },
    { label: 'Total Invoices', value: invoices.length.toString(), note: 'Recorded transactions', tone: 'blue', symbol: '▣' },
  ]

  return (
    <div className="billing-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Financial Operations &amp; Billing</h1>
          <p>Manage clinic invoices, patient claims, accounts receivable, and payment settlements.</p>
        </div>
        <button className="dark-action" type="button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? '✕ Close Form' : '⊕ Generate New Invoice'}
        </button>
      </header>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
          {error}
        </div>
      )}

      <div className="stats-grid">
        {statCardsData.map((stat) => <StatCard {...stat} key={stat.label} />)}
      </div>

      {showAddForm && (
        <SectionCard title="Generate New Invoice">
          <form onSubmit={handleAddInvoiceSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
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
              Service Description *
              <input
                type="text"
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Invoice Amount ($) *
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
              Due Date *
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--color-bg, #090d16)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
              />
            </label>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="button button--secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="button button--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Generating...' : 'Create Invoice'}</button>
            </div>
          </form>
        </SectionCard>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <input
            type="search"
            placeholder="Search invoices by code or service description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--color-surface, #111827)', border: '1px solid var(--color-border, #1f2937)', color: '#fff' }}
          />
          <button className="dark-action" type="submit">Search</button>
        </form>

        <div className="filter-chips" style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
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
        <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.8 }}>Loading billing ledger...</p>
      ) : invoices.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
          <h3>No Invoices Found</h3>
          <p style={{ color: 'var(--color-text-muted, #9ca3af)', marginTop: '0.5rem' }}>No billing transactions match your current search criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface, #111827)', borderRadius: '12px', border: '1px solid var(--color-border, #1f2937)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border, #1f2937)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Invoice ID</th>
                <th style={{ padding: '1rem' }}>Patient Name</th>
                <th style={{ padding: '1rem' }}>Service Description</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Due Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const patientName = inv.patient ? `${inv.patient.firstName} ${inv.patient.lastName}` : 'Patient'
                const dueDateFormatted = inv.dueDate
                  ? new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'N/A'

                return (
                  <tr key={inv._id} style={{ borderBottom: '1px solid var(--color-border, #1f2937)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-teal-light, #2dd4bf)' }}>{inv.invoiceCode || inv._id.slice(-6).toUpperCase()}</td>
                    <td style={{ padding: '1rem' }}>{patientName}</td>
                    <td style={{ padding: '1rem' }}>{inv.service}</td>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>${inv.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{dueDateFormatted}</td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={inv.status === 'Paid' ? 'Confirmed' : inv.status === 'Overdue' ? 'Cancelled' : 'Pending'} />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {inv.status !== 'Paid' && (
                        <button
                          type="button"
                          className="dark-action"
                          onClick={() => handlePay(inv._id)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          Mark as Paid →
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BillingPage
