<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
=======
import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
>>>>>>> 5e988b0
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

<<<<<<< HEAD
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (without password)
    req.user = await User.findById(decoded.id).select("-password");

    next();

=======
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
>>>>>>> 5e988b0
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

<<<<<<< HEAD
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} role not allowed`
=======
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} role not allowed`,
>>>>>>> 5e988b0
      });
    }
    next();
  };
<<<<<<< HEAD
};
=======
};
>>>>>>> 5e988b0
