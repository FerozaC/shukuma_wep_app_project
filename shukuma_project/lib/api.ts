const base = process.env.NEXT_PUBLIC_API_URL
const API_URL = base
  ? (base.endsWith("/api") ? base : `${base}/api`)
  : "http://localhost:5000/api"

export const api = {
  auth: {
    register: async (data: { name: string; email: string; password: string }) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    login: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    getMe: async (token: string) => {
      const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      return res.json()
    },
  },
  workouts: {
    getAll: async (token: string) => {
      const res = await fetch(`${API_URL}/workouts`, { headers: { Authorization: `Bearer ${token}` } })
      return res.json()
    },
    create: async (token: string, data: any) => {
      const res = await fetch(`${API_URL}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    getCards: async () => {
      const res = await fetch(`${API_URL}/workouts/cards`)
      return res.json()
    },
  },
  sessions: {
    save: async (token: string, data: any) => {
      const res = await fetch(`${API_URL}/sessions/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    getHistory: async (token: string) => {
      const res = await fetch(`${API_URL}/sessions/history`, { headers: { Authorization: `Bearer ${token}` } })
      return res.json()
    },
  },
}
