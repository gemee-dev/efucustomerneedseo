"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - accept any email/password
    if (email && password) {
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" : "user",
      }
      setUser(mockUser)
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  }

  const logout = async () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
