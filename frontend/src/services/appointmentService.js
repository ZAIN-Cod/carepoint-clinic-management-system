import { api } from './api.js'

export const appointmentService = {
  async getAppointments(filters = {}) {
    const params = new URLSearchParams()
    if (filters.department && filters.department !== 'All') {
      params.append('department', filters.department)
    }
    if (filters.status && filters.status !== 'All') {
      params.append('status', filters.status)
    }
    if (filters.date) {
      params.append('date', filters.date)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    return await api.get(`/appointments${query}`)
  },

  async getAppointmentById(id) {
    return await api.get(`/appointments/${id}`)
  },

  async createAppointment(appointmentData) {
    return await api.post('/appointments', appointmentData)
  },

  async updateAppointment(id, appointmentData) {
    return await api.put(`/appointments/${id}`, appointmentData)
  },

  async deleteAppointment(id) {
    return await api.del(`/appointments/${id}`)
  },
}
