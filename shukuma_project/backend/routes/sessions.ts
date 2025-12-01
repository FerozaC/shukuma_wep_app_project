import express from "express"
import { saveSession, getHistory } from "../controllers/sessions"
import { protect } from "../middleware/auth"

const router = express.Router()

router.post("/save", protect, saveSession)
router.get("/history", protect, getHistory)

export default router
