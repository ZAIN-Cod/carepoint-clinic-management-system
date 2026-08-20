import { api } from './api.js'

export const dashboardService = {
  async getStats() {
    return await api.get('/dashboard/stats')
  },
}
