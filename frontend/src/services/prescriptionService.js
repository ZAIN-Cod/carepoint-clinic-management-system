import { api } from './api.js'

export const prescriptionService = {
  async getPrescriptions(filters = {}) {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== 'All') {
      params.append('status', filters.status)
    }
    if (filters.search) {
      params.append('search', filters.search)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return await api.get(`/prescriptions${query}`)
  },

  async createPrescription(prescriptionData) {
    return await api.post('/prescriptions', prescriptionData)
  },

  async requestRefill(id) {
    return await api.put(`/prescriptions/${id}/refill`, {})
  },
}
