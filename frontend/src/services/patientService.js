import { api } from './api.js'

export const patientService = {
  async getPatients(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    return await api.get(`/patients${query}`)
  },

  async getPatientById(id) {
    return await api.get(`/patients/${id}`)
  },

  async createPatient(patientData) {
    return await api.post('/patients', patientData)
  },

  async updatePatient(id, patientData) {
    return await api.put(`/patients/${id}`, patientData)
  },

  async deletePatient(id) {
    return await api.del(`/patients/${id}`)
  },
}
