"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  streak: number
  workoutHistory: Array<{
    cardsCompleted: number
    totalTime: number
    date: string
  }>
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (savedToken) {
      setToken(savedToken)
      api.auth.getMe(savedToken).then((res) => {
        if (res.success) {
          setUser(res.user)
        } else {
          localStorage.removeItem("token")
          setToken(null)
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await api.auth.register(data)
    if (res.success) {
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem("token", res.token)
    } else {
      throw new Error(res.message)
    }
  }

  const login = async (data: { email: string; password: string }) => {
    const res = await api.auth.login(data)
    if (res.success) {
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem("token", res.token)
    } else {
      throw new Error(res.message)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
