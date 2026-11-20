import { createContext, useContext, useState } from 'react'
import { USE_MOCK } from '../api/client'

const AuthContext = createContext(null)
const KEY = 'campusfix_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(KEY) || 'null'))

  // Demo auth. Replace with Amazon Cognito for production.
  const login = ({ email, role }) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ')
    const u = {
      email, role, name,
      studentId: USE_MOCK ? 'stu-001' : email.toLowerCase(),
    }
    localStorage.setItem(KEY, JSON.stringify(u))
    setUser(u)
    return u
  }
  const logout = () => { localStorage.removeItem(KEY); setUser(null) }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
