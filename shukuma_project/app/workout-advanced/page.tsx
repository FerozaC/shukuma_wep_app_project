"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import {
  type ExerciseCard,
  generateDeckWithBreaks,
  shuffleDeck,
  type BreakSession,
  type DeckItem,
} from "@/lib/deck-engine"
import { ExerciseCardComponent } from "@/components/exercise-card"
import { BreakScreen } from "@/components/break-screen"
import { Button } from "@/components/ui/button"

const SAMPLE_EXERCISES: ExerciseCard[] = [
  { id: "1", name: "Push Ups", difficulty: "Beginner", image: "💪", repsOrDuration: "10 reps", muscleGroup: "Chest, Shoulders" },
  { id: "2", name: "Squats", difficulty: "Intermediate", image: "🦵", repsOrDuration: "15 reps", muscleGroup: "Legs" },
  { id: "3", name: "Jumping Jacks", difficulty: "Beginner", image: "🤸", repsOrDuration: "20 reps", muscleGroup: "Full Body" },
  { id: "4", name: "Plank", difficulty: "Intermediate", image: "📏", repsOrDuration: "30 seconds", muscleGroup: "Core" },
  { id: "5", name: "Burpees", difficulty: "Advanced", image: "🏃", repsOrDuration: "10 reps", muscleGroup: "Full Body" },
  { id: "6", name: "Mountain Climbers", difficulty: "Advanced", image: "⛰️", repsOrDuration: "30 seconds", muscleGroup: "Core, Cardio" },
]

export default function WorkoutAdvancedPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { token } = useAuth()
  const router = useRouter()

  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [deck, setDeck] = useState<DeckItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardsCompleted, setCardsCompleted] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [sessionActive, setSessionActive] = useState(false)

  if (loading || !isAuthenticated) {
    return null
  }

  const handleStartWorkout = () => {
    setShowDisclaimer(false)
    const shuffled = shuffleDeck(SAMPLE_EXERCISES)
    const deckWithBreaks = generateDeckWithBreaks(shuffled)
    setDeck(deckWithBreaks)
    setSessionActive(true)
    setStartTime(new Date())
  }

  if (showDisclaimer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">Ready to Move?</h1>

          <div className="bg-white rounded-2xl p-12 shadow-lg mb-8">
            <div className="bg-blue-100 rounded-2xl p-8 mb-8 text-center">
              <p className="text-6xl mb-4">⚠️</p>
              <h2 className="text-2xl font-bold text-gray-900">Workout Disclaimer</h2>
              <p className="text-gray-600 mt-4">
                Please ensure you're in a safe environment. Perform exercises at your own pace and stop if you experience any discomfort.
              </p>
            </div>

            <Button onClick={handleStartWorkout} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg">
              Proceed to Workout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (deck.length === 0) {
    return null
  }

  const currentItem = deck[currentIndex]
  const isBreak = currentItem.type === "break"
  const currentCard = currentItem.data as ExerciseCard | BreakSession
  const progressPercent = ((currentIndex + 1) / deck.length) * 100

  const handleNextCard = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      if (currentItem.type === "exercise") {
        setCardsCompleted(cardsCompleted + 1)
      }
    } else {
      handleFinishWorkout()
    }
  }

  const handleFinishWorkout = async () => {
    const endTime = new Date()
    const totalTime = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0

    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cardsCompleted, totalTime }),
      })
    }

    router.push(`/workout-complete?cards=${cardsCompleted}&time=${totalTime}`)
  }

  if (isBreak) {
    return <BreakScreen breakSession={currentCard as BreakSession} onBreakComplete={handleNextCard} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">Exercise {cardsCompleted + 1} / {SAMPLE_EXERCISES.length}</div>
          <button onClick={() => router.push("/dashboard")} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Exit
          </button>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="max-w-xs w-full mb-12">
        <ExerciseCardComponent card={currentCard as ExerciseCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
      </div>

      <div className="max-w-md w-full">
        <Button onClick={handleNextCard} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg">
          {currentIndex === deck.length - 1 ? "Finish Workout" : "Next"}
        </Button>
      </div>
    </div>
  )
}
