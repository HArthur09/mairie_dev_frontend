import axios from 'axios'
import { refreshToken } from './auth'
import { notification } from 'antd'


//const API_BASE = 'http://localhost:8000/api';
const isDevelopment = import.meta.env.MODE === 'development';
const mybaseURL = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY;
const API_BASE = mybaseURL.endsWith('/') ? mybaseURL : mybaseURL + '/';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ajout du token sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 🔁 si le token est expiré => refresh automatique
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const data = await refreshToken()
        api.defaults.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (err) {
        notification.error({
          message: 'Session exipirée',
          description: 'Votre session a expiré, Veuillez vous reconnecter.',
          duration: 5,
        });
        console.error('Refresh token failed', err)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
