"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { ChartBar } from "@/components/chart-bar"

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    streak: 0,
    totalCards: 0,
    lastWorkout: "Never",
    totalReps: 0,
  })

  useEffect(() => {
    if (user) {
      const totalCards = user.workoutHistory.reduce((sum, w) => sum + w.cardsCompleted, 0)
      const lastWorkout = user.workoutHistory.length > 0 ? user.workoutHistory[0].date : "Never"

      setStats({
        streak: user.streak || 0,
        totalCards,
        lastWorkout: lastWorkout === "Never" ? "Never" : "Yesterday",
        totalReps: totalCards * 10,
      })
    }
  }, [user])

  if (loading || !isAuthenticated) {
    return null
  }

  const chartData = [
    { name: "Mon", value: 8 },
    { name: "Tue", value: 12 },
    { name: "Wed", value: 15 },
    { name: "Thu", value: 10 },
    { name: "Fri", value: 14 },
    { name: "Sat", value: 11 },
    { name: "Sun", value: 7 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo/shukuma-icon.jpg" alt="Shukuma" width={40} height={40} className="rounded-lg" />
            <h1 className="text-2xl font-bold text-gray-900">Shukuma</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-gray-900 font-medium">
              Dashboard
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-gray-900">
              History
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </nav>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-white cursor-pointer font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Welcome back, {user?.name}!</h2>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <Image
                  src="/assets/illustrations/hero-welcome.jpg"
                  alt="Ready for your next challenge"
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for your next challenge?</h3>
              <p className="text-gray-600 mb-6">Start a new workout and keep the momentum going!</p>
              <Button
                onClick={() => router.push("/workout")}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-full"
              >
                Start Workout
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon="/assets/icons/streak.jpg" label="Current Streak" value={`${stats.streak} Days`} />
          <StatCard icon="📋" label="Total Cards" value={stats.totalCards.toLocaleString()} />
          <StatCard icon="📅" label="Last Workout" value={stats.lastWorkout} />
          <StatCard icon="⚡" label="Total Reps" value={stats.totalReps.toLocaleString()} trend={{ label: "vs. Last Week", value: "+5%" }} />
        </div>

        <ChartBar data={chartData} title="Your Week in Review" description="Cards Completed" />
      </main>
    </div>
  )
}
