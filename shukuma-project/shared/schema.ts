import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  streak: integer("streak").notNull().default(0),
  totalCards: integer("total_cards").notNull().default(0),
  totalReps: integer("total_reps").notNull().default(0),
  lastWorkoutDate: timestamp("last_workout_date"),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cardsCompleted: integer("cards_completed").notNull(),
  totalTime: text("total_time").notNull(),
  cards: jsonb("cards").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  assignedTo: varchar("assigned_to"),
  cards: jsonb("cards").$type<string[]>().notNull(),
  duration: integer("duration"),
  level: text("level"),
  goals: text("goals"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull().references(() => workoutSessions.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).pick({
  cardsCompleted: true,
  totalTime: true,
  cards: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  cards: true,
  duration: true,
  level: true,
  goals: true,
  assignedTo: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  sessionId: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type User = typeof users.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Review = typeof reviews.$inferSelect;
