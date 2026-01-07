import { useState, useEffect, useCallback } from 'react'
import { login as loginService, logout as logoutService } from '../api/auth'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setUser(token ? { token } : null)
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await loginService(username, password)
    setUser({ token: data.access })
  }, [])

  const logout = useCallback(() => {
    logoutService()
    setUser(null)
  }, [])

  return { user, login, logout, loading }
}
