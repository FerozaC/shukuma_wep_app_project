"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { ExerciseCategory } from "@/lib/exercise-assets"
import { filterAssets, shuffle } from "@/lib/exercise-assets"

export default function WorkoutGuestPage() {
  const [started, setStarted] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardsCompleted, setCardsCompleted] = useState(0)
  const [category, setCategory] = useState<ExerciseCategory | undefined>(undefined)

  const deck = useMemo(() => shuffle(filterAssets(category)), [category])

  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-amber-100 text-amber-800",
    Advanced: "bg-red-100 text-red-800",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {!started && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Try Shukuma as a Guest</h1>
            <p className="text-gray-600 text-lg">Experience our exercise deck without creating an account</p>
          </div>
        )}

        {!started ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-8">
            <p className="text-gray-700 mb-8">
              As a guest, you can try out a sample workout. Your progress won't be saved, but you can create an account
              after to keep your stats.
            </p>

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

            <Button
              onClick={() => {
                setStarted(true)
                setCurrentCardIndex(0)
                setIsFlipped(false)
                setCardsCompleted(0)
              }}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 px-8 rounded-full text-lg"
            >
              Start Workout
            </Button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="flex items-center justify-between mb-6">
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
        )}

        <div className="text-center">
          <Link href="/" className="text-sky-600 hover:text-sky-700 font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
