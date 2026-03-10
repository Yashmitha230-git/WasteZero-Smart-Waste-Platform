<<<<<<< HEAD
const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;
=======
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
>>>>>>> 5e988b0
