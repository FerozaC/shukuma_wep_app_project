import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

interface AuthRequest extends Request {
  user?: {
    id: string
  }
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.user = decoded as { id: string }
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" })
  }
}
