import api from './axios'

// Création complète d’un mariage
export async function createMariage(mariageData) {
  const { data } = await api.post('/mairie/mariages/', mariageData)
  return data
}
