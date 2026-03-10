import express from "express";
import Pickup from "../model/pickup.js";
import { createPickup, getPickups } from "../controller/dashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("Pickup routes loaded");

// ===================================================
// 🔹 VOLUNTEER → CREATE PICKUP REQUEST
// ===================================================
router.post(
  "/",
  protect,
  authorizeRoles("volunteer"),
  async (req, res) => {
    try {
      const pickup = await Pickup.create({
        ...req.body,
        volunteer: req.user._id,
        status: "Pending", // default status
      });

      res.status(201).json(pickup);
    } catch (error) {
      console.error("Error creating pickup:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===================================================
// 🔹 GET ALL PICKUPS (Both NGO & Volunteer)
// ===================================================
router.get("/", protect, getPickups);

// ===================================================
// 🔹 NGO → ACCEPT PICKUP
// ===================================================
router.put(
  "/:id/accept",
  protect,
  authorizeRoles("ngo"),
  async (req, res) => {
    try {
      const pickup = await Pickup.findByIdAndUpdate(
        req.params.id,
        { status: "Accepted" },
        { new: true }
      );

      if (!pickup) {
        return res.status(404).json({ message: "Pickup not found" });
      }

      res.status(200).json(pickup);
    } catch (error) {
      console.error("Error accepting pickup:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===================================================
// 🔹 NGO → REJECT PICKUP
// ===================================================
router.put(
  "/:id/reject",
  protect,
  authorizeRoles("ngo"),
  async (req, res) => {
    try {
      const pickup = await Pickup.findByIdAndUpdate(
        req.params.id,
        { status: "Rejected" },
        { new: true }
      );

      if (!pickup) {
        return res.status(404).json({ message: "Pickup not found" });
      }

      res.status(200).json(pickup);
    } catch (error) {
      console.error("Error rejecting pickup:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===================================================
// 🔹 MARK AS CLOSED (After completion)
// ===================================================
router.put(
  "/:id/complete",
  protect,
  authorizeRoles("ngo"),
  async (req, res) => {
    try {
      const pickup = await Pickup.findByIdAndUpdate(
        req.params.id,
        { status: "Closed" },
        { new: true }
      );

      if (!pickup) {
        return res.status(404).json({ message: "Pickup not found" });
      }

      res.status(200).json(pickup);
    } catch (error) {
      console.error("Error completing pickup:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===================================================
// 🔹 DELETE PICKUP (Optional - Admin or NGO)
// ===================================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("ngo", "admin"),
  async (req, res) => {
    try {
      const pickup = await Pickup.findByIdAndDelete(req.params.id);

      if (!pickup) {
        return res.status(404).json({ message: "Pickup not found" });
      }

      res.status(200).json({ message: "Pickup deleted" });
    } catch (error) {
      console.error("Error deleting pickup:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;