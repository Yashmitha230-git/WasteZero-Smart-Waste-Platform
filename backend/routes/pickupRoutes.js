import express from "express";
import Pickup from "../model/pickup.js";
import { createPickup, getPickups } from "../controller/dashboardController.js";

const router = express.Router();

console.log("Pickup routes loaded");

router.post("/", createPickup);
router.get("/", getPickups);

// ✅ MARK AS CLOSED
router.put("/:id/complete", async (req, res) => {
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
});

// ✅ DELETE PICKUP
router.delete("/:id", async (req, res) => {
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
});

export default router;