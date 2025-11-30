import { connectMongo } from "./db";
import {
  User as UserModel,
  WorkoutSession as WorkoutSessionModel,
  Workout as WorkoutModel,
  Review as ReviewModel,
} from "../shared/mongo-models";
import type {
  User,
  InsertUser,
  WorkoutSession,
  InsertWorkoutSession,
  Workout,
  InsertWorkout,
  Review,
  InsertReview,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(id: string, cardsCompleted: number): Promise<User | undefined>;
  
  createWorkoutSession(userId: string, session: InsertWorkoutSession): Promise<WorkoutSession>;
  getWorkoutSessions(userId: string): Promise<WorkoutSession[]>;
  getWorkoutSession(id: string): Promise<WorkoutSession | undefined>;
  
  createWorkout(userId: string, workout: InsertWorkout): Promise<Workout>;
  getWorkouts(userId: string): Promise<Workout[]>;
  
  createReview(userId: string, review: InsertReview): Promise<Review>;
  
  getUserStats(userId: string): Promise<{ streak: number; totalCards: number; totalReps: number; lastWorkout: Date | null; weeklyData: { day: string; cards: number }[] }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    await connectMongo();
    const doc = await UserModel.findById(id).lean();
    if (!doc) return undefined;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      streak: doc.streak ?? 0,
      totalCards: doc.totalCards ?? 0,
      totalReps: doc.totalReps ?? 0,
      lastWorkoutDate: doc.lastWorkoutDate ?? null,
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await connectMongo();
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return undefined;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      streak: doc.streak ?? 0,
      totalCards: doc.totalCards ?? 0,
      totalReps: doc.totalReps ?? 0,
      lastWorkoutDate: doc.lastWorkoutDate ?? null,
    } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await connectMongo();
    const created = await UserModel.create(insertUser);
    return {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
      password: created.password,
      streak: created.streak ?? 0,
      totalCards: created.totalCards ?? 0,
      totalReps: created.totalReps ?? 0,
      lastWorkoutDate: created.lastWorkoutDate ?? null,
    } as User;
  }

  async updateUserStats(id: string, cardsCompleted: number): Promise<User | undefined> {
    await connectMongo();
    const user = await UserModel.findById(id).lean();
    if (!user) return undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWorkout = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
    let newStreak = user.streak ?? 0;

    if (lastWorkout) {
      const lastWorkoutDay = new Date(lastWorkout);
      lastWorkoutDay.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastWorkoutDay.getTime() === yesterday.getTime()) {
        newStreak = (user.streak ?? 0) + 1;
      } else if (lastWorkoutDay.getTime() < yesterday.getTime()) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updated = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          streak: newStreak,
          totalCards: (user.totalCards ?? 0) + cardsCompleted,
          totalReps: (user.totalReps ?? 0) + cardsCompleted * 10,
          lastWorkoutDate: new Date(),
        },
      },
      { new: true }
    ).lean();

    if (!updated) return undefined;
    return {
      id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      password: updated.password,
      streak: updated.streak ?? 0,
      totalCards: updated.totalCards ?? 0,
      totalReps: updated.totalReps ?? 0,
      lastWorkoutDate: updated.lastWorkoutDate ?? null,
    } as User;
  }

  async createWorkoutSession(userId: string, session: InsertWorkoutSession): Promise<WorkoutSession> {
    await connectMongo();
    const createdDoc = await WorkoutSessionModel.create({
      userId,
      cardsCompleted: session.cardsCompleted,
      totalTime: session.totalTime,
      cards: session.cards,
      createdAt: new Date(),
    });

    await this.updateUserStats(userId, session.cardsCompleted);

    return {
      id: createdDoc._id.toString(),
      userId: createdDoc.userId.toString(),
      cardsCompleted: createdDoc.cardsCompleted,
      totalTime: createdDoc.totalTime,
      cards: createdDoc.cards,
      createdAt: createdDoc.createdAt!,
    } as WorkoutSession;
  }

  async getWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
    await connectMongo();
    const docs = await WorkoutSessionModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((s) => ({
      id: s._id.toString(),
      userId: s.userId.toString(),
      cardsCompleted: s.cardsCompleted,
      totalTime: s.totalTime,
      cards: s.cards,
      createdAt: s.createdAt!,
    }));
  }

  async getWorkoutSession(id: string): Promise<WorkoutSession | undefined> {
    await connectMongo();
    const s = await WorkoutSessionModel.findById(id).lean();
    if (!s) return undefined;
    return {
      id: s._id.toString(),
      userId: s.userId.toString(),
      cardsCompleted: s.cardsCompleted,
      totalTime: s.totalTime,
      cards: s.cards,
      createdAt: s.createdAt!,
    } as WorkoutSession;
  }

  async createWorkout(userId: string, workout: InsertWorkout): Promise<Workout> {
    await connectMongo();
    const createdDoc = await WorkoutModel.create({
      userId,
      cards: workout.cards,
      duration: workout.duration,
      level: workout.level,
      goals: workout.goals,
      assignedTo: workout.assignedTo,
      createdAt: new Date(),
    });
    return {
      id: createdDoc._id.toString(),
      userId: createdDoc.userId.toString(),
      cards: createdDoc.cards,
      duration: createdDoc.duration,
      level: createdDoc.level,
      goals: createdDoc.goals,
      assignedTo: createdDoc.assignedTo,
      createdAt: createdDoc.createdAt!,
    } as Workout;
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    await connectMongo();
    const docs = await WorkoutModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((w) => ({
      id: w._id.toString(),
      userId: w.userId.toString(),
      cards: w.cards,
      duration: w.duration,
      level: w.level,
      goals: w.goals,
      assignedTo: w.assignedTo,
      createdAt: w.createdAt!,
    }));
  }

  async createReview(userId: string, review: InsertReview): Promise<Review> {
    await connectMongo();
    const createdDoc = await ReviewModel.create({
      userId,
      sessionId: review.sessionId,
      content: review.content,
      createdAt: new Date(),
    });
    return {
      id: createdDoc._id.toString(),
      userId: createdDoc.userId.toString(),
      sessionId: createdDoc.sessionId.toString(),
      content: createdDoc.content,
      createdAt: createdDoc.createdAt!,
    } as Review;
  }

  async getUserStats(userId: string): Promise<{
    streak: number;
    totalCards: number;
    totalReps: number;
    lastWorkout: Date | null;
    weeklyData: { day: string; cards: number }[];
  }> {
    await connectMongo();
    const user = await this.getUser(userId);
    if (!user) {
      return { streak: 0, totalCards: 0, totalReps: 0, lastWorkout: null, weeklyData: [] };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sessions = await WorkoutSessionModel.find({
      userId,
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ createdAt: 1 })
      .lean();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyMap = new Map<string, number>();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      weeklyMap.set(dayName, 0);
    }

    for (const session of sessions) {
      const dayName = days[new Date(session.createdAt!).getDay()];
      weeklyMap.set(dayName, (weeklyMap.get(dayName) || 0) + session.cardsCompleted);
    }

    const weeklyData = Array.from(weeklyMap.entries()).map(([day, cards]) => ({
      day,
      cards,
    }));

    return {
      streak: user.streak,
      totalCards: user.totalCards,
      totalReps: user.totalReps,
      lastWorkout: user.lastWorkoutDate ?? null,
      weeklyData,
    };
  }
}

export const storage = new DatabaseStorage();
