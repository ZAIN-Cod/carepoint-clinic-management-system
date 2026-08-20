import { api } from './api.js'

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    if (res.token) {
      localStorage.setItem('carepoint_token', res.token)
    }
    return res
  },

  async getMe() {
    return await api.get('/auth/me')
  },

  async logout() {
    try {
      await api.post('/auth/logout', {})
    } catch (err) {
      // Ignore network error on logout
    } finally {
      localStorage.removeItem('carepoint_token')
    }
  },
}
