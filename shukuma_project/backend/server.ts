import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db"
import authRoutes from "./routes/auth"
import workoutRoutes from "./routes/workouts"
import sessionRoutes from "./routes/sessions"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect database
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/workouts", workoutRoutes)
app.use("/api/sessions", sessionRoutes)

// Basic root and health check routes
app.get("/", (_req, res) => {
  res.send("Shukuma Backend is running. Try /api/health");
})

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
