import axios from 'axios'

const BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
})

export const register = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const addFriend = (payload) => api.post('/conv/addfriend', payload)

// Placeholder endpoints (require backend support)
export const getUsers = () => api.get('/users')
export const getConversations = () => api.get('/conv/list')
export const getMessages = (convId) => api.get(`/conv/${convId}/messages`)
export const createGroup = (payload) => api.post('/groups', payload)
export const sendMessage = (payload) => api.post('/conv/message', payload)

export default api
