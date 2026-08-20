const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('carepoint_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (response.status === 401) {
    localStorage.removeItem('carepoint_token')
    window.dispatchEvent(new Event('carepoint:unauthorized'))
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    data = { success: false, message: 'Server returned an invalid JSON response.' }
  }

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status}`
    const error = new Error(errorMessage)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  del: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
}
