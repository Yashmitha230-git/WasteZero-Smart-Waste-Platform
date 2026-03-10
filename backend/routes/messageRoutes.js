import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getConversation, clearConversation, markAsRead, getUnreadCounts } from "../controller/dashboardController.js";

const router = express.Router();

// GET → Fetch Unread Counts
router.get("/unread", protect, getUnreadCounts);

// POST → Send Message
router.post("/", protect, sendMessage);

// PUT → Mark as read
router.put("/read", protect, markAsRead);

// GET → Fetch History
router.get("/:otherUserId", protect, getConversation);

// DELETE → Clear History
router.delete("/:otherUserId", protect, clearConversation);

export default router;