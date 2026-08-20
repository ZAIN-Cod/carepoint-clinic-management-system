import { api } from './api.js'

export const clinicianService = {
  async getClinicians() {
    return await api.get('/clinicians')
  },

  async getClinicianById(id) {
    return await api.get(`/clinicians/${id}`)
  },
}
