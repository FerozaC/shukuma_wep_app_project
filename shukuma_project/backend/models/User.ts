import mongoose from "mongoose"
import bcrypt from "bcrypt"

interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  streak: number
  workoutHistory: Array<{
    cardsCompleted: number
    totalTime: number
    date: Date
  }>
  createdAt: Date
  matchPassword(enteredPassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    streak: {
      type: Number,
      default: 0,
    },
    workoutHistory: [
      {
        cardsCompleted: Number,
        totalTime: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model<IUser>("User", userSchema)
