import mongoose from "mongoose"

interface ISession extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId
  cardsCompleted: number
  totalTime: number
  workoutId?: mongoose.Schema.Types.ObjectId
  completedAt: Date
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardsCompleted: {
      type: Number,
      required: true,
    },
    totalTime: {
      type: Number,
      required: true,
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model<ISession>("Session", sessionSchema)
