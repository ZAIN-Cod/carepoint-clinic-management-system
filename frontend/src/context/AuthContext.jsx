import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('carepoint_token'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('carepoint_token')
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const res = await authService.getMe()
        if (res.success && res.data) {
          setUser(res.data)
        } else {
          localStorage.removeItem('carepoint_token')
          setToken(null)
          setUser(null)
        }
      } catch (err) {
        localStorage.removeItem('carepoint_token')
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    function handleUnauthorized() {
      setUser(null)
      setToken(null)
      localStorage.removeItem('carepoint_token')
    }

    window.addEventListener('carepoint:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('carepoint:unauthorized', handleUnauthorized)
  }, [])

  async function login(email, password) {
    setError(null)
    try {
      const res = await authService.login(email, password)
      if (res.token && res.user) {
        setToken(res.token)
        setUser(res.user)
        return res.user
      }
      throw new Error(res.message || 'Login failed')
    } catch (err) {
      const msg = err.message || 'Authentication failed'
      setError(msg)
      throw new Error(msg)
    }
  }

  async function logout() {
    await authService.logout()
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
