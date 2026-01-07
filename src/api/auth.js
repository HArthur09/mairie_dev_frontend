import api from './axios'
import { jwtDecode } from 'jwt-decode'


export async function login(username, password) {
  const { data } = await api.post('user/Users/login/', { username, password })
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export async function refreshToken() {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) throw new Error('No refresh token')
  const { data } = await api.post('/token/refresh/', { refresh })
  localStorage.setItem('access_token', data.access)
  return data
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getUserFromToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}