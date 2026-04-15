import { createContext, useContext, useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const boot = async () => {
      const storedUser = localStorage.getItem('mangorush_user')
      const storedToken = localStorage.getItem('mangorush_token')
      if (!storedUser || !storedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(API_ENDPOINTS.me, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        if (!response.ok) {
          throw new Error('Session expired')
        }
        const data = await response.json()
        setUser(data.user)
        setToken(storedToken)
      } catch (_error) {
        localStorage.removeItem('mangorush_user')
        localStorage.removeItem('mangorush_token')
      } finally {
        setLoading(false)
      }
    }

    boot()
  }, [])

  const login = async ({ email, password }) => {
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('mangorush_user', JSON.stringify(data.user))
    localStorage.setItem('mangorush_token', data.token)

    return data.user
  }

  const register = async ({ name, email, password }) => {
    const response = await fetch(API_ENDPOINTS.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('mangorush_user', JSON.stringify(data.user))
    localStorage.setItem('mangorush_token', data.token)

    return data.user
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('mangorush_user')
    localStorage.removeItem('mangorush_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)