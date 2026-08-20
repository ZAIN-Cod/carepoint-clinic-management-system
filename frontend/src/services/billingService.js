import { api } from './api.js'

export const billingService = {
  async getInvoices(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== 'All') {
      params.append('status', filters.status)
    }
    if (filters.search) {
      params.append('search', filters.search)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return await api.get(`/billing${query}`)
  },

  async createInvoice(invoiceData) {
    return await api.post('/billing', invoiceData)
  },

  async markAsPaid(id) {
    return await api.put(`/billing/${id}/pay`, {})
  },
}
