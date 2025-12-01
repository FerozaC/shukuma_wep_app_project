import express from "express"
import { getWorkouts, createWorkout, assignWorkout, getCards } from "../controllers/workouts"
import { protect } from "../middleware/auth"

const router = express.Router()

router.get("/", protect, getWorkouts)
router.post("/", protect, createWorkout)
router.post("/assign", protect, assignWorkout)
router.get("/cards", getCards)

export default router
