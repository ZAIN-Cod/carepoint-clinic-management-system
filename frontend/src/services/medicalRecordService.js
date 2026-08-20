import { api } from './api.js'

export const medicalRecordService = {
  async getRecords(filters = {}) {
    const params = new URLSearchParams()
    if (filters.recordType && filters.recordType !== 'All') {
      params.append('recordType', filters.recordType)
    }
    if (filters.search) {
      params.append('search', filters.search)
    }
    if (filters.patientId) {
      params.append('patientId', filters.patientId)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return await api.get(`/medical-records${query}`)
  },

  async createRecord(recordData) {
    return await api.post('/medical-records', recordData)
  },
}
