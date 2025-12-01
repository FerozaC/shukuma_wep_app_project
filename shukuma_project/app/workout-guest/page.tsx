"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
]

export default function WorkoutGuestPage() {
  const [started, setStarted] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardsCompleted, setCardsCompleted] = useState(0)

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-red-100 text-red-800",
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

            <Button
              onClick={() => setStarted(true)}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 px-8 rounded-full text-lg"
            >
              Start Sample Workout
            </Button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Card {currentCardIndex + 1} / {SAMPLE_CARDS.length}
              </div>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / SAMPLE_CARDS.length) * 100}%` }}
              />
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="aspect-video bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center cursor-pointer transform transition-transform hover:scale-105 border-4 border-sky-200"
            >
              {!isFlipped ? (
                <div className="text-center">
                  <div className="text-8xl mb-4">{SAMPLE_CARDS[currentCardIndex].image}</div>
                  <p className="text-gray-600 text-sm">Tap to reveal</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-4">{SAMPLE_CARDS[currentCardIndex].name}</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      difficultyColors[SAMPLE_CARDS[currentCardIndex].difficulty]
                    }`}
                  >
                    {SAMPLE_CARDS[currentCardIndex].difficulty}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-10">
              <Button
                onClick={() => {
                  if (currentCardIndex < SAMPLE_CARDS.length - 1) {
                    setCurrentCardIndex(currentCardIndex + 1)
                    setIsFlipped(false)
                    setCardsCompleted(cardsCompleted + 1)
                  }
                }}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-6 rounded-full text-lg"
              >
                {currentCardIndex === SAMPLE_CARDS.length - 1 ? "Finish" : "Next Card"}
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
