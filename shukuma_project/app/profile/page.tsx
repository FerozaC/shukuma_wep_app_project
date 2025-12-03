"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"

export default function ProfilePage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  if (loading || !isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveChanges = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="profile" />

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-3xl p-12 mb-8 text-center">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 text-4xl border-4 border-white font-bold text-white">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{user?.name}</h1>
          <p className="text-white/90">{user?.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Current Streak</p>
            <p className="text-3xl font-bold text-amber-500 mt-2">{user?.streak || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Total Workouts</p>
            <p className="text-3xl font-bold text-sky-500 mt-2">{user?.workoutHistory.length || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm">Total Cards</p>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {user?.workoutHistory.reduce((sum, w) => sum + w.cardsCompleted, 0) || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <button onClick={() => setIsEditing(!isEditing)} className="text-sky-600 hover:text-sky-700 font-medium">
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                  disabled
                />
              </div>
              <Button
                onClick={handleSaveChanges}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2 rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-gray-900 font-medium text-lg">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900 font-medium text-lg">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Email workout reminders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Show weekly statistics</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700">Allow sharing achievements</span>
            </label>
          </div>
        </div>

        <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg">
          Logout
        </Button>
      </main>
    </div>
  )
}
