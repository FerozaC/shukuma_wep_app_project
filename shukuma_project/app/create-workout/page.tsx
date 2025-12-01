"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EXERCISE_GOALS, DIFFICULTY_LEVELS, createWorkout } from "@/lib/workout-builder"

const AVAILABLE_EXERCISES = [
  { id: "1", name: "Push Ups", difficulty: "Beginner" },
  { id: "2", name: "Squats", difficulty: "Intermediate" },
  { id: "3", name: "Jumping Jacks", difficulty: "Beginner" },
  { id: "4", name: "Plank", difficulty: "Intermediate" },
  { id: "5", name: "Burpees", difficulty: "Advanced" },
  { id: "6", name: "Mountain Climbers", difficulty: "Advanced" },
]

export default function CreateWorkoutPage() {
  const { isAuthenticated, loading } = useAuthRedirect()
  const { token } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "Beginner" as const,
    selectedGoals: [] as string[],
    selectedExercises: [] as string[],
  })

  if (loading || !isAuthenticated) {
    return null
  }

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter((g) => g !== goal)
        : [...prev.selectedGoals, goal],
    }))
  }

  const handleExerciseToggle = (exerciseId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedExercises: prev.selectedExercises.includes(exerciseId)
        ? prev.selectedExercises.filter((e) => e !== exerciseId)
        : [...prev.selectedExercises, exerciseId],
    }))
  }

  const handleCreateWorkout = async () => {
    const workout = createWorkout(
      formData.name,
      formData.description,
      formData.selectedExercises,
      formData.level,
      formData.selectedGoals,
    )

    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          cards: formData.selectedExercises,
          level: formData.level,
          goals: formData.selectedGoals,
          duration: 30,
        }),
      })
    }

    router.push("/workouts")
  }

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
          <div className="text-gray-600">Step {step} of 4</div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {step === 1 && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Create Your Workout</h1>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Power Routine"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's this workout about?"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  rows={4}
                />
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.name}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Next: Choose Difficulty
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Choose Difficulty Level</h1>
            <div className="grid gap-4 mb-8">
              {DIFFICULTY_LEVELS.map((diffLevel) => (
                <button
                  key={diffLevel.level}
                  onClick={() => setFormData({ ...formData, level: diffLevel.level as any })}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.level === diffLevel.level
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{diffLevel.icon}</div>
                    <div>
                      <p className="font-bold text-gray-900">{diffLevel.level}</p>
                      <p className="text-gray-600 text-sm">{diffLevel.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 py-3 rounded-lg">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg"
              >
                Next: Select Goals
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">What are Your Goals?</h1>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {EXERCISE_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.selectedGoals.includes(goal)
                      ? "border-amber-400 bg-amber-50 text-amber-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1 py-3 rounded-lg">
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={formData.selectedGoals.length === 0}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Next: Choose Exercises
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Exercises</h1>
            <div className="space-y-3 mb-8">
              {AVAILABLE_EXERCISES.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseToggle(exercise.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                    formData.selectedExercises.includes(exercise.id)
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-900">{exercise.name}</p>
                    <p className="text-gray-600 text-sm">{exercise.difficulty}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      formData.selectedExercises.includes(exercise.id)
                        ? "border-amber-400 bg-amber-400"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.selectedExercises.includes(exercise.id) && "✓"}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setStep(3)} variant="outline" className="flex-1 py-3 rounded-lg">
                Back
              </Button>
              <Button
                onClick={handleCreateWorkout}
                disabled={formData.selectedExercises.length === 0}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                Create Workout
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
