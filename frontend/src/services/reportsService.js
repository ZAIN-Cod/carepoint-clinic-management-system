import { api } from './api.js'

export const reportsService = {
  async getAnalytics() {
    return await api.get('/reports/analytics')
  },
}
