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
    // server currently doesn't return user object; keep email locally
    setUser({ email: payload.email })
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
