import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import pickupRoutes from "./routes/pickupRoutes.js";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// FIXED STATIC PATH
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/opportunity", opportunityRoutes);
app.use("/api/pickups", pickupRoutes);

app.listen(3000, () =>
  console.log("Server running on port 3000")
);