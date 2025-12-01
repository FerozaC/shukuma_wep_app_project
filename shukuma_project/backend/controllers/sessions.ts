import type { Request, Response } from "express"
import Session from "../models/Session"
import User from "../models/User"

interface AuthRequest extends Request {
  user?: { id: string }
}

// Save session
export const saveSession = async (req: AuthRequest, res: Response) => {
  try {
    const { cardsCompleted, totalTime, workoutId } = req.body

    const session = await Session.create({
      userId: req.user?.id,
      cardsCompleted,
      totalTime,
      workoutId,
    })

    // Update user streak and history
    const user = await User.findById(req.user?.id)
    if (user) {
      user.workoutHistory.push({
        cardsCompleted,
        totalTime,
        date: new Date(),
      })
      user.streak = (user.streak || 0) + 1
      await user.save()
    }

    res.status(201).json({ success: true, session })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// Get session history
export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({ userId: req.user?.id }).sort({ completedAt: -1 })
    res.json({ success: true, sessions })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}
