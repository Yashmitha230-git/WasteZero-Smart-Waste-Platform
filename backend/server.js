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
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import Notification from "./model/notification.js";
import adminRoutes from "./routes/adminRoutes.js";

import { getDashboardData } from "./controller/dashboardController.js";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", userRoutes); // auth routes: /login, /register, /verify-otp
app.use("/api/opportunity", opportunityRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/users", userRoutes); // user routes: GET / (list users), /me, etc.
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

const users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Users:", users);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const recipient = getUser(receiverId);

      await Notification.create({
        recipient: receiverId,
        sender: senderId,
        type: "message",
        content: `New message: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`,
        link: "/messages",
      });

      if (recipient) {
        io.to(recipient.socketId).emit("receiveMessage", {
          senderId,
          receiverId,
          text,
        });
        io.to(recipient.socketId).emit("newNotification");
      }
    } catch (error) {
      console.log("Socket message error:", error);
    }
  });

  socket.on("disconnect", () => {
    const index = users.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
    }
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);