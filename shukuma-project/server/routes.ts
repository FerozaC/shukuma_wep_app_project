import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authMiddleware,
  optionalAuthMiddleware,
  type AuthenticatedRequest,
} from "./auth";
import { insertUserSchema, loginSchema, insertWorkoutSessionSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

const defaultExercises = [
  { id: "1", name: "Jumping Jacks", level: "Medium", cardNumber: 7 },
  { id: "2", name: "Push Ups", level: "Hard", cardNumber: 10 },
  { id: "3", name: "Squats", level: "Easy", cardNumber: 3 },
  { id: "4", name: "Lunges", level: "Medium", cardNumber: 5 },
  { id: "5", name: "Burpees", level: "Hard", cardNumber: 9 },
  { id: "6", name: "Mountain Climbers", level: "Medium", cardNumber: 6 },
  { id: "7", name: "Plank", level: "Easy", cardNumber: 2 },
  { id: "8", name: "High Knees", level: "Medium", cardNumber: 8 },
  { id: "9", name: "Tricep Dips", level: "Hard", cardNumber: 11 },
  { id: "10", name: "Bicycle Crunches", level: "Medium", cardNumber: 4 },
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
      }

      const { name, email, password } = parsed.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user.id);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          totalCards: user.totalCards,
          totalReps: user.totalReps,
        },
        token,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
      }

      const { email, password } = parsed.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken(user.id);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          streak: user.streak,
          totalCards: user.totalCards,
          totalReps: user.totalReps,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalCards: user.totalCards,
        totalReps: user.totalReps,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Stats Route
  app.get("/api/stats", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await storage.getUserStats(req.userId!);
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // Workout Session Routes
  app.post("/api/sessions", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = insertWorkoutSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
      }

      const session = await storage.createWorkoutSession(req.userId!, parsed.data);
      res.json(session);
    } catch (error) {
      console.error("Create session error:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.get("/api/sessions", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const sessions = await storage.getWorkoutSessions(req.userId!);
      res.json(sessions);
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({ error: "Failed to get sessions" });
    }
  });

  // Reviews
  app.post("/api/reviews", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = insertReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
      }

      const review = await storage.createReview(req.userId!, parsed.data);
      res.json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Exercise Cards (static data)
  app.get("/api/exercises", optionalAuthMiddleware, async (req, res) => {
    try {
      res.json(defaultExercises);
    } catch (error) {
      console.error("Get exercises error:", error);
      res.status(500).json({ error: "Failed to get exercises" });
    }
  });

  // Filter options
  app.get("/api/filters", optionalAuthMiddleware, async (req, res) => {
    res.json({
      durations: [5, 10, 15, 20, 30],
      levels: ["Easy", "Medium", "Hard"],
      goals: ["Cardio", "Strength", "Flexibility", "Full Body"],
    });
  });

  return httpServer;
}
