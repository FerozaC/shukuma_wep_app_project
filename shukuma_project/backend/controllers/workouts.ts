import type { Request, Response } from "express"
import Workout from "../models/Workout"

interface AuthRequest extends Request {
  user?: { id: string }
}

export const getWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const workouts = await Workout.find({ userId: req.user?.id })
    res.json({ success: true, workouts })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { cards, duration, level, goals, name } = req.body

    const workout = await Workout.create({
      userId: req.user?.id,
      cards,
      duration,
      level,
      goals,
      name,
    })

    res.status(201).json({ success: true, workout })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const assignWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { workoutId, assignedToId } = req.body

    const workout = await Workout.findByIdAndUpdate(workoutId, { assignedTo: assignedToId }, { new: true })

    res.json({ success: true, workout })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = [
      "pushups.png",
      "squats.png",
      "jumping-jacks.png",
      "plank.png",
      "burpees.png",
      "mountain-climbers.png",
    ]

    res.json({ success: true, cards })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}
