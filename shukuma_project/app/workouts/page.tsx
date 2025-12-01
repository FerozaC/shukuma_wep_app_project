"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

interface Workout {
  _id: string
  name: string
  level: string
  goals: string[]
  duration: number
}

export default function WorkoutsPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { token } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchWorkouts()
    }
  }, [token])

  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setWorkouts(data.workouts)
      }
    } catch (error) {
      console.error("Error fetching workouts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || !isAuthenticated) {
    return null
  }

  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-amber-100 text-amber-800",
    Advanced: "bg-red-100 text-red-800",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center text-white font-bold">
              ⚡
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Shukuma</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Workouts</h1>
          <Link href="/create-workout">
            <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-full">
              Create New
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading workouts...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">No workouts created yet</p>
            <Link href="/create-workout">
              <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-full">
                Create Your First Workout
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{workout.name}</h3>

                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        // @ts-ignore
                        levelColors[workout.level] || levelColors.Beginner
                      }`}
                    >
                      {workout.level}
                    </span>
                  </div>

                  {workout.goals && workout.goals.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-2">Goals:</p>
                      <div className="flex flex-wrap gap-2">
                        {workout.goals.map((goal) => (
                          <span key={goal} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2 rounded-lg text-sm">
                      Start
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-900 font-semibold py-2 rounded-lg text-sm bg-transparent">
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
