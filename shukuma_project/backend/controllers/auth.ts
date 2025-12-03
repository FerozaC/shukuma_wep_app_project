import type { Request, Response } from "express"
import User from "../models/User"
import { generateToken } from "../utils/generateToken"

interface AuthRequest extends Request {
  user?: { id: string }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already exists" })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id.toString())

    res.status(201).json({ success: true, token, user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(user._id.toString())
    res.json({ success: true, token, user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" })
  }
}
