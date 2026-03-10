import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import pickupRoutes from "./routes/pickupRoutes.js";
import { Server } from "socket.io";
import Message from "./model/messages.js";
import http from "http";   // ✅ FIXED
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dashboardRoutes from "./routes/dashboardRoute.js";

import { getDashboardData } from "./controller/dashboardController.js";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);  // ✅ Required for socket

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", userRoutes);
app.use("/api/opportunity", opportunityRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes)

// Store online users
const onlineUsers = new Map();
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins so multiple frontend instances work
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  const userIndex = users.findIndex((user) => user.userId === userId);
  if (userIndex !== -1) {
    users[userIndex].socketId = socketId;
  } else {
    users.push({ userId, socketId });
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === String(userId));
};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Add user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Users:", users);
  });

  // Send message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("receiveMessage", {
        senderId,
        receiverId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);