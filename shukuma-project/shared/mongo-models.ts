import { mongoose } from "../server/db";

const { Schema, model, models } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    streak: { type: Number, default: 0 },
    totalCards: { type: Number, default: 0 },
    totalReps: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date },
  },
  { timestamps: false }
);

const WorkoutSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cardsCompleted: { type: Number, required: true },
    totalTime: { type: String, required: true },
    cards: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const WorkoutSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: String },
    cards: { type: [String], required: true },
    duration: { type: Number },
    level: { type: String },
    goals: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const ReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "WorkoutSession", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const User = models.User || model("User", UserSchema);
export const WorkoutSession = models.WorkoutSession || model("WorkoutSession", WorkoutSessionSchema);
export const Workout = models.Workout || model("Workout", WorkoutSchema);
export const Review = models.Review || model("Review", ReviewSchema);

export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  password: string;
  streak: number;
  totalCards: number;
  totalReps: number;
  lastWorkoutDate?: Date;
};

export type WorkoutSessionDoc = {
  _id: string;
  userId: string;
  cardsCompleted: number;
  totalTime: string;
  cards: string[];
  createdAt: Date;
};

export type WorkoutDoc = {
  _id: string;
  userId: string;
  assignedTo?: string;
  cards: string[];
  duration?: number;
  level?: string;
  goals?: string;
  createdAt: Date;
};

export type ReviewDoc = {
  _id: string;
  userId: string;
  sessionId: string;
  content: string;
  createdAt: Date;
};
