import React, { createContext, useContext, useState } from 'react'
import * as api from '../api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const register = async (payload) => {
    const res = await api.register(payload)
    return res
  }

  const login = async (payload) => {
    const res = await api.login(payload)
    const userData = res?.data?.data?.user || res?.data?.user || { email: payload.email }
    setUser(userData)
    return res
  }

  const logout = () => {
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
