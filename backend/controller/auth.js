
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => { 
  try {
    const { name, email, username, password, role } = req.body;

    // Check required fields
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create new user (not verified yet)
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      isVerified: false,
      otp,
      otpExpiry
    });

    await newUser.save();

    // Send OTP to email
    await sendEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      userId: newUser._id
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
 };

export const verifyRegisterOtp = async (req, res) => { 
   try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
  return res.status(400).json({ message: "User not found" });
}

if (String(user.otp) !== String(otp)) {
  return res.status(400).json({ message: "Invalid OTP" });
}

if (user.otpExpiry < Date.now()) {
  return res.status(400).json({ message: "OTP expired" });
}

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      message: "Account verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message
    });
  }
 };

export const loginUser = async (req, res) => { 
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate OTP for login
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email",
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
 };

export const verifyLoginOtp = async (req, res) => { 
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

   if (!user) {
  return res.status(400).json({ message: "User not found" });
}

if (String(user.otp) !== String(otp)) {
  return res.status(400).json({ message: "Invalid OTP" });
}

if (user.otpExpiry < Date.now()) {
  return res.status(400).json({ message: "OTP expired" });
}

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate JWT after OTP success
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message
    });
  }
 };

 