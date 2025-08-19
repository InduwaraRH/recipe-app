import React, { createContext, useContext, useEffect, useState } from 'react'
import * as auth from '../api/auth.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // on mount, check session
    auth.me().then(u => {
      setUser(u)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    await auth.login(email, password) // sets cookie
    const u = await auth.me()
    setUser(u)
  }
  const register = async (email, password) => {
    await auth.register(email, password)
    const u = await auth.me()
    setUser(u)
  }
  const logout = async () => {
    await auth.logout()
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
