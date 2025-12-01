"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

interface WorkoutCard {
  id: string
  name: string
  difficulty: "Easy" | "Medium" | "Hard"
  image: string
}

const SAMPLE_CARDS: WorkoutCard[] = [
  { id: "1", name: "Push Ups", difficulty: "Easy", image: "💪" },
  { id: "2", name: "Squats", difficulty: "Medium", image: "🦵" },
  { id: "3", name: "Jumping Jacks", difficulty: "Medium", image: "🤸" },
  { id: "4", name: "Plank", difficulty: "Hard", image: "📏" },
  { id: "5", name: "Burpees", difficulty: "Hard", image: "🏃" },
  { id: "6", name: "Mountain Climbers", difficulty: "Hard", image: "⛰️" },
]

export default function WorkoutPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { token } = useAuth()
  const router = useRouter()
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cardsCompleted, setCardsCompleted] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)

  if (loading || !isAuthenticated) {
    return null
  }

  const handleStartWorkout = () => {
    setShowDisclaimer(false)
    setSessionActive(true)
    setStartTime(new Date())
  }

  const handleNextCard = () => {
    if (currentCardIndex < SAMPLE_CARDS.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
      setCardsCompleted(cardsCompleted + 1)
    } else {
      handleFinishWorkout()
    }
  }

  const handleFinishWorkout = () => {
    const endTime = new Date()
    const totalTime = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardsCompleted: cardsCompleted + 1,
          totalTime,
        }),
      })
    }

    router.push(`/workout-complete?cards=${cardsCompleted + 1}&time=${totalTime}`)
  }

  const currentCard = SAMPLE_CARDS[currentCardIndex]
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-red-100 text-red-800",
  }

  if (showDisclaimer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">Ready to Move?</h1>

          <div className="bg-white rounded-2xl p-12 shadow-lg mb-8">
            <div className="bg-blue-100 rounded-2xl p-8 mb-8 text-center">
              <p className="text-6xl mb-4">⚠️</p>
              <h2 className="text-2xl font-bold text-gray-900">Disclaimer</h2>
              <p className="text-gray-600 mt-4">
                Please ensure you're in a safe environment and consult with a healthcare professional before starting
                any new exercise routine. Perform exercises at your own pace and stop if you experience any discomfort.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1" />
                <label className="text-gray-700">I understand the risks and am ready to proceed</label>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-1" />
                <label className="text-gray-700">I have consulted with a healthcare professional</label>
              </div>
            </div>

            <Button
              onClick={handleStartWorkout}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg"
            >
              Proceed to Workout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Card {currentCardIndex + 1} / {SAMPLE_CARDS.length}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Exit Workout
          </button>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / SAMPLE_CARDS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-md w-full">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="aspect-video bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center cursor-pointer transform transition-transform hover:scale-105 border-4 border-sky-200"
        >
          {!isFlipped ? (
            <div className="text-center">
              <div className="text-8xl mb-4">{currentCard.image}</div>
              <p className="text-gray-600 text-sm">Tap to reveal</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-4">{currentCard.name}</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${difficultyColors[currentCard.difficulty]}`}
              >
                {currentCard.difficulty}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md w-full mt-12">
        <Button
          onClick={handleNextCard}
          className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg"
        >
          {currentCardIndex === SAMPLE_CARDS.length - 1 ? "Finish Workout" : "Next Card"}
        </Button>
      </div>

      <div className="max-w-md w-full mt-8 text-center">
        <p className="text-gray-600">Cards completed: {cardsCompleted}</p>
      </div>
    </div>
  )
}
