"use client"
import type { ExerciseCard } from "@/lib/deck-engine"
import Image from "next/image"

interface ExerciseCardProps {
  card: ExerciseCard
  onFlip?: () => void
  isFlipped?: boolean
}

const EXERCISE_IMAGES: Record<string, string> = {
  "Jumping Jacks": "/assets/cards/jumping-jacks.jpg",
  "Push Ups": "/assets/cards/pushups.jpg",
  Squats: "/assets/cards/squats.jpg",
  Burpees: "/assets/cards/burpees.jpg",
  Plank: "/assets/cards/plank.jpg",
  Lunges: "/assets/cards/lunges.jpg",
  "Mountain Climbers": "/assets/cards/mountain-climbers.jpg",
  "High Knees": "/assets/cards/high-knees.jpg",
  "Tricep Dips": "/assets/cards/tricep-dips.jpg",
  "Bicycle Crunches": "/assets/cards/bicycle-crunches.jpg",
}

export function ExerciseCardComponent({ card, onFlip, isFlipped = false }: ExerciseCardProps) {
  const exerciseImage = EXERCISE_IMAGES[card.name] || "/assets/cards/jumping-jacks.jpg"

  return (
    <div onClick={onFlip} className="relative w-full aspect-[2/3] cursor-pointer perspective group">
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute w-full h-full bg-gradient-to-br from-blue-100 to-sky-200 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image src={exerciseImage || "/placeholder.svg"} alt={card.name} fill className="object-cover" priority />
        </div>

        <div
          className="absolute w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-6xl mb-4">{card.image}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{card.name}</h2>

          <div className="space-y-2 w-full">
            <div className="inline-block bg-white/60 px-4 py-2 rounded-full mb-2">
              <span
                className={`text-sm font-semibold ${
                  card.difficulty === "Beginner"
                    ? "text-green-600"
                    : card.difficulty === "Intermediate"
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {card.difficulty}
              </span>
            </div>

            <p className="text-lg text-gray-800 font-medium">{card.repsOrDuration}</p>
            <p className="text-sm text-gray-700">{card.muscleGroup}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
