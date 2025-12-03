import type { Request, Response } from "express"
import Session from "../models/Session"
import User from "../models/User"

interface AuthRequest extends Request {
  user?: { id: string }
}

export const saveSession = async (req: AuthRequest, res: Response) => {
  try {
    const { cardsCompleted, totalTime, workoutId } = req.body

    const session = await Session.create({
      userId: req.user?.id,
      cardsCompleted,
      totalTime,
      workoutId,
    })

    const user = await User.findById(req.user?.id)
    if (user) {
      const now = new Date()
      // Push the workout entry
      user.workoutHistory.push({
        cardsCompleted,
        totalTime,
        date: now,
      })

      const history = user.workoutHistory
        .map((h) => new Date(h.date))
        .sort((a, b) => b.getTime() - a.getTime())

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      const recentBeforeToday = history.find((d) => {
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        return dd.getTime() < today.getTime()
      })

      const recentDay = recentBeforeToday
        ? new Date(recentBeforeToday.getFullYear(), recentBeforeToday.getMonth(), recentBeforeToday.getDate())
        : null

      const lastIsToday = history.some((d) => {
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        return dd.getTime() === today.getTime()
      })

      if (lastIsToday) {
        user.streak = user.streak || 1
      } else if (recentDay && recentDay.getTime() === yesterday.getTime()) {
        user.streak = (user.streak || 0) + 1
      } else {
        user.streak = 1
      }

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
