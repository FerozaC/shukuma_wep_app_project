"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

interface WorkoutEntry {
  id: string
  date: string
  cardsCompleted: number
  totalTime: number
  avgTime: number
}

export default function HistoryPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { user } = useAuth()
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([])

  useEffect(() => {
    if (user?.workoutHistory) {
      const history = user.workoutHistory.map((w, idx) => ({
        id: `${idx}-${w.date}`,
        date: new Date(w.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        cardsCompleted: w.cardsCompleted,
        totalTime: w.totalTime,
        avgTime: Math.floor(w.totalTime / w.cardsCompleted),
      }))
      setWorkoutHistory(history)
    }
  }, [user])

  if (loading || !isAuthenticated) {
    return null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80">
              <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center text-white font-bold">
                ⚡
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shukuma</h1>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/history" className="text-gray-900 font-medium">
              History
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Workout History</h2>

        {workoutHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">No workouts yet!</p>
            <Link href="/workout">
              <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-full">
                Start Your First Workout
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {workoutHistory.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Date</p>
                    <p className="text-gray-900 font-bold text-lg">{entry.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Cards Completed</p>
                    <p className="text-gray-900 font-bold text-lg">{entry.cardsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Time</p>
                    <p className="text-gray-900 font-bold text-lg">{formatTime(entry.totalTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Avg per Card</p>
                    <p className="text-gray-900 font-bold text-lg">{formatTime(entry.avgTime)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {workoutHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm">Total Workouts</p>
              <p className="text-4xl font-bold text-amber-500 mt-3">{workoutHistory.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm">Total Cards</p>
              <p className="text-4xl font-bold text-sky-500 mt-3">
                {workoutHistory.reduce((sum, w) => sum + w.cardsCompleted, 0)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm">Total Time</p>
              <p className="text-4xl font-bold text-green-500 mt-3">
                {formatTime(workoutHistory.reduce((sum, w) => sum + w.totalTime, 0))}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
