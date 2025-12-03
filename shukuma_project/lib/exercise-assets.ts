export type ExerciseCategory = "cardio" | "lower-body" | "upper-body"

export interface ExerciseAsset {
  id: string
  name: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  imagePath: string
  muscleGroup: string
  category: ExerciseCategory
}

// Map public assets by category. Update paths to match files under public/assets/*
const cardioFiles = [
  "burpees.png",
  "burpees2.png",
  "burpees3.png",
  "burpees4.png",
  "burpees5.png",
  "jumping-jacks.png",
  "jumping-jacks2.png",
  "jumping-jacks3.png",
  "jumping-jacks4.png",
  "reverse-burpee.png",
  "reverse-burpee2.png",
  "tuck-jumps.png",
  "tuck-jumps2.png",
]

const lowerBodyFiles = [
  "crab-toe-touchers.png",
  "crab-toe-touchers2.png",
  "crab-toe-touchers3.png",
  "crab-toe-touchers4.png",
  "curtsy-lunge.png",
  "curtsy-lunge2.png",
  "jumping-split-lunge.png",
  "jumping-split-lunge2.png",
  "plant-to-push-up.png",
  "plant-to-push-up2.png",
  "prison-squat.png",
  "prison-squat2.png",
  "prison-squat3.png",
  "prison-squat4.png",
  "sit-ups.png",
  "sit-ups2.png",
  "sit-ups3.png",
  "sit-ups4.png",
  "sit-ups5.png",
  "squat.png",
  "squat2.png",
  "squat3.png",
  "squat4.png",
  "squat5.png",
  "v-ups.png",
  "v-ups2.png",
]

const upperBodyFiles = [
  "decline-push-up.png",
  "decline-push-up2.png",
  "pike-push-up.png",
  "pike-push-up2.png",
  "pike-push-up3.png",
  "pike-push-up4.png",
  "push-up-to-toe-touch.png",
  "push-up-to-toe-touch2.png",
  "push-up.png",
  "push-up2.png",
  "push-up3.png",
  "push-up4.png",
  "push-up5.png",
]

const slugToTitle = (slug: string) =>
  slug
    .replace(/\.png$/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

const mapFiles = (
  files: string[],
  basePath: string,
  category: ExerciseCategory,
  muscleGroup: string,
): ExerciseAsset[] =>
  files.map((f, idx) => ({
    id: `${category}-${idx}`,
    name: slugToTitle(f),
    difficulty: "Intermediate",
    imagePath: `${basePath}/${f}`,
    muscleGroup,
    category,
  }))

export const EXERCISE_ASSETS: ExerciseAsset[] = [
  ...mapFiles(cardioFiles, "/assets/cards/cardio", "cardio", "Full Body/Cardio"),
  ...mapFiles(lowerBodyFiles, "/assets/cards/lower-body", "lower-body", "Legs/Core"),
  ...mapFiles(upperBodyFiles, "/assets/cards/upper-body", "upper-body", "Chest/Shoulders/Arms"),
]

export const filterAssets = (category?: ExerciseCategory): ExerciseAsset[] => {
  if (!category) return EXERCISE_ASSETS
  return EXERCISE_ASSETS.filter((a) => a.category === category)
}

export const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
