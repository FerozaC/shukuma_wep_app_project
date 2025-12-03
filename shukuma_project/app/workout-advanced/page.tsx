"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import type { ExerciseCategory } from "@/lib/exercise-assets"
import { filterAssets, shuffle } from "@/lib/exercise-assets"
import { api } from "@/lib/api"

export default function WorkoutAdvancedPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { token, refresh } = useAuth()
  const router = useRouter()

  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardsCompleted, setCardsCompleted] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [category, setCategory] = useState<ExerciseCategory | undefined>(undefined)

  const deck = useMemo(() => shuffle(filterAssets(category)), [category])

  if (loading || !isAuthenticated) {
    return null
  }

  const handleStartWorkout = () => {
    setShowDisclaimer(false)
    setStartTime(new Date())
    setCurrentCardIndex(0)
    setCardsCompleted(0)
    setIsFlipped(false)
  }

  const finishAndSave = async () => {
    const endTime = new Date()
    const totalTime = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0

    if (token) {
      await api.sessions.save(token, { cardsCompleted: cardsCompleted + 1, totalTime }).catch(() => {})
      await refresh().catch(() => {})
    }
    router.push(`/workout-complete?cards=${cardsCompleted + 1}&time=${totalTime}`)
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

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Button
                variant={category === undefined ? "default" : "outline"}
                className="px-4 py-2 rounded-full"
                onClick={() => setCategory(undefined)}
              >
                All
              </Button>
              <Button
                variant={category === "cardio" ? "default" : "outline"}
                className="px-4 py-2 rounded-full"
                onClick={() => setCategory("cardio")}
              >
                Cardio
              </Button>
              <Button
                variant={category === "lower-body" ? "default" : "outline"}
                className="px-4 py-2 rounded-full"
                onClick={() => setCategory("lower-body")}
              >
                Lower Body
              </Button>
              <Button
                variant={category === "upper-body" ? "default" : "outline"}
                className="px-4 py-2 rounded-full"
                onClick={() => setCategory("upper-body")}
              >
                Upper Body
              </Button>
            </div>

            <Button onClick={handleStartWorkout} className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg">
              Proceed to Workout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-between mb-6 w-full">
            <div className="text-sm text-gray-600">
              Card {currentCardIndex + 1} / {deck.length}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFlipped(false)}>
                Hide
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsFlipped(true)}>
                Reveal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentCardIndex(0)
                  setIsFlipped(false)
                  setCardsCompleted(0)
                }}
              >
                Reshuffle
              </Button>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${deck.length ? (((currentCardIndex + 1) / deck.length) * 100) : 0}%` }}
            />
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full max-w-sm aspect-[7/10] bg-white rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center cursor-pointer transform transition-transform hover:scale-105 border-4 border-sky-200"
          >
            {!isFlipped ? (
              <div className="text-center w-full flex flex-col items-center">
                <div className="mb-2">
                  <Image
                    src="/assets/illustrations/deck_back.png"
                    alt="Card back"
                    width={250}
                    height={357}
                    className="rounded-xl bg-white border border-gray-200"
                    priority
                  />
                </div>
                <p className="text-gray-600 text-sm">Tap to reveal</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {deck[currentCardIndex] && (
                  <Image
                    src={deck[currentCardIndex].imagePath}
                    alt={deck[currentCardIndex].name}
                    width={250}
                    height={357}
                    className="object-contain rounded-xl bg-white border border-gray-200"
                    priority
                  />
                )}
              </div>
            )}
          </div>

          <div className="mt-10 w-full max-w-sm">
            <Button
              onClick={() => {
                if (currentCardIndex < deck.length - 1) {
                  setCurrentCardIndex(currentCardIndex + 1)
                  setIsFlipped(false)
                  setCardsCompleted(cardsCompleted + 1)
                } else {
                  finishAndSave()
                }
              }}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg"
            >
              {currentCardIndex === deck.length - 1 ? "Finish" : "Next Card"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Cards completed: {cardsCompleted}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
