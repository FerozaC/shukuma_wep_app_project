export interface CustomWorkout {
  id: string
  name: string
  description: string
  cards: string[]
  duration: number
  level: "Beginner" | "Intermediate" | "Advanced"
  goals: string[]
  createdAt: Date
  createdBy: string
}

export const EXERCISE_GOALS = [
  "Strength Building",
  "Cardio",
  "Flexibility",
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "Core Strength",
]

export const DIFFICULTY_LEVELS = [
  { level: "Beginner", description: "20-30 minutes", icon: "🟢" },
  { level: "Intermediate", description: "30-45 minutes", icon: "🟡" },
  { level: "Advanced", description: "45+ minutes", icon: "🔴" },
]

export const createWorkout = (
  name: string,
  description: string,
  cards: string[],
  level: "Beginner" | "Intermediate" | "Advanced",
  goals: string[],
): CustomWorkout => {
  const durationMap = { Beginner: 25, Intermediate: 38, Advanced: 50 }
  return {
    id: `workout-${Date.now()}`,
    name,
    description,
    cards,
    duration: durationMap[level],
    level,
    goals,
    createdAt: new Date(),
    createdBy: "user",
  }
}
