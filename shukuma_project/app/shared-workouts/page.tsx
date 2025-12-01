"use client"

import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SharedWorkoutsPage() {
  const { loading } = useAuthRedirect()

  if (loading) return null

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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Workouts Assigned to You</h1>

        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-600 text-lg mb-6">No workouts assigned yet</p>
          <p className="text-gray-500 mb-8">When friends assign workouts to you, they'll appear here.</p>
          <Link href="/dashboard">
            <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3 rounded-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
