export interface ExerciseCard {
  id: string
  name: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  image: string
  repsOrDuration: string
  muscleGroup: string
}

export interface DeckItem {
  type: "exercise" | "break"
  data: ExerciseCard | BreakSession
  cardIndex: number
}

export interface BreakSession {
  id: string
  duration: number
  type: "short" | "long"
  message: string
}

const BREAK_PATTERN = {
  shortBreak: { interval: 2, duration: 30, type: "short" as const },
  longBreak: { interval: 4, duration: 60, type: "long" as const },
}

export const generateDeckWithBreaks = (cards: ExerciseCard[]): DeckItem[] => {
  const deck: DeckItem[] = []
  let cardCount = 0
  let exerciseCount = 0

  for (let i = 0; i < cards.length; i++) {
    deck.push({ type: "exercise", data: cards[i], cardIndex: cardCount++ })
    exerciseCount++

    if (exerciseCount % 4 === 0 && i < cards.length - 1) {
      const breakSession: BreakSession = {
        id: `break-long-${exerciseCount}`,
        duration: BREAK_PATTERN.longBreak.duration,
        type: "long",
        message: "Time for a longer break! Hydrate and catch your breath.",
      }
      deck.push({ type: "break", data: breakSession, cardIndex: cardCount++ })
    } else if (exerciseCount % 2 === 0 && i < cards.length - 1 && exerciseCount % 4 !== 0) {
      const breakSession: BreakSession = {
        id: `break-short-${exerciseCount}`,
        duration: BREAK_PATTERN.shortBreak.duration,
        type: "short",
        message: "Quick break! Catch your breath.",
      }
      deck.push({ type: "break", data: breakSession, cardIndex: cardCount++ })
    }
  }

  return deck
}

export const shuffleDeck = (cards: ExerciseCard[]): ExerciseCard[] => {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const calculateWorkoutStats = (deckLength: number, totalTime: number) => {
  const avgCardTime = totalTime / deckLength
  const estimatedCalories = Math.floor((totalTime / 60) * 5)
  const intensity = avgCardTime < 15 ? "High" : avgCardTime < 30 ? "Medium" : "Low"
  return { avgCardTime, estimatedCalories, intensity }
}
