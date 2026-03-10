import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage } from "../controller/dashboardController.js";

const router = express.Router();

// POST → Send Message
router.post("/",protect, sendMessage);

export default router;