import mongoose from "mongoose"

interface IWorkout extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId
  assignedTo?: mongoose.Schema.Types.ObjectId
  cards: string[]
  duration: number
  level: "Beginner" | "Intermediate" | "Advanced"
  goals: string[]
  name: string
  createdAt: Date
}

const workoutSchema = new mongoose.Schema<IWorkout>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cards: [String],
    duration: Number,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    goals: [String],
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<IWorkout>("Workout", workoutSchema)
