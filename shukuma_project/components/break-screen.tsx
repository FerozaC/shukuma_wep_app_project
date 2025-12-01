"use client"

import { useEffect, useState } from "react"
import type { BreakSession } from "@/lib/deck-engine"

interface BreakScreenProps {
  breakSession: BreakSession
  onBreakComplete: () => void
}

export function BreakScreen({ breakSession, onBreakComplete }: BreakScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(breakSession.duration)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onBreakComplete()
      return
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft, onBreakComplete])

  const isLongBreak = breakSession.type === "long"

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isLongBreak ? "bg-gradient-to-b from-blue-100 to-sky-200" : "bg-gradient-to-b from-green-100 to-emerald-200"
      }`}
    >
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{isLongBreak ? "Take a Longer Break" : "Quick Break"}</h1>

        <p className="text-xl text-gray-700 mb-12">{breakSession.message}</p>

        <div className="w-48 h-48 rounded-full border-8 border-white shadow-xl flex items-center justify-center mx-auto mb-12">
          <div className="text-7xl font-bold text-gray-900">{secondsLeft}</div>
        </div>

        <div className="mb-8">
          <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isLongBreak ? "bg-blue-500" : "bg-green-500"}`}
              style={{ width: `${((breakSession.duration - secondsLeft) / breakSession.duration) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-gray-700 text-sm">{secondsLeft === 0 ? "Get ready to continue!" : "Break time"}</p>
      </div>
    </div>
  )
}
