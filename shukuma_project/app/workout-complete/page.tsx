"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WorkoutCompletePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const cards = searchParams.get("cards") || "0"
  const time = searchParams.get("time") || "0"

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Well Done!</h1>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Progress</span>
              <span className="text-green-600 font-bold">100%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm">Cards Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{cards}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm">Total Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatTime(Number.parseInt(time))}</p>
            </div>
          </div>

          <p className="text-center text-gray-600 mb-8">Thank you for trying out Shukuma!</p>

          <div className="space-y-3">
            <Button onClick={() => router.push("/workout")} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-full">
              Do Another Workout
            </Button>
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full border-gray-300 text-gray-900 font-semibold py-3 rounded-full bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How was your experience?</h2>
          <textarea placeholder="Share your thoughts..." className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400" rows={4} />
          <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-full">
            Share Feedback
          </Button>
        </div>
      </div>
    </div>
  )
}
