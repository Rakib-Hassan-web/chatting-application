import React, { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('accessToken')
    } catch (err) {
      return null
    }
  })
  const navigate = useNavigate()

  const register = async (payload) => {
    const res = await api.register(payload)
    return res
  }

  const login = async (payload) => {
    const res = await api.login(payload)
    const userData = res?.data?.data?.user || res?.data?.user || { email: payload.email }
    const accessToken = res?.data?.data?.accessToken || res?.data?.accessToken
    setUser(userData)
    if (accessToken) setToken(accessToken)
    // persist access token for other components (e.g., socket handshake)
    try {
      if (accessToken) localStorage.setItem('accessToken', accessToken)
    } catch (err) {}
    return res
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try { localStorage.removeItem('accessToken') } catch (err) {}
    navigate('/login')
  }

  useEffect(() => {
    try {
      if (token) localStorage.setItem('accessToken', token)
      else localStorage.removeItem('accessToken')
    } catch (err) {}
  }, [token])

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
