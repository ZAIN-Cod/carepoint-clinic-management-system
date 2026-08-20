import { api } from './api.js'

export const doctorService = {
  async getDoctors(filters = {}) {
    const params = new URLSearchParams()
    if (filters.specialization && filters.specialization !== 'All') {
      params.append('specialization', filters.specialization)
    }
    if (filters.status && filters.status !== 'All') {
      params.append('status', filters.status)
    }
    if (filters.search) {
      params.append('search', filters.search)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return await api.get(`/clinicians${query}`)
  },

  async getDoctorById(id) {
    return await api.get(`/clinicians/${id}`)
  },

  async createDoctor(doctorData) {
    return await api.post('/clinicians', doctorData)
  },
}
