import express from "express";
import upload from "../middleware/multer.js";
import { createOpportunity, updateOpportunity } from "../controller/dashboardController.js";
import Opportunity from "../model/opportunity.js";

const router = express.Router();

console.log("Opportunity routes loaded");

// CREATE
router.post("/create", upload.single("image"), createOpportunity);


// GET ALL  ⭐ REQUIRED
router.get("/", async (req, res) => {
  try {
    const data = await Opportunity.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const data = await Opportunity.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id",upload.single("image"),updateOpportunity);

// DELETE OPPORTUNITY
router.delete("/:id", async (req, res) => {
  console.log("DELETE HIT", req.params.id);
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity)
      return res.status(404).json({ msg: "Opportunity not found" });

    // delete image from uploads folder
    if (opportunity.image) {
      const fs = await import("fs");
      const path = `.${opportunity.image}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }

    await opportunity.deleteOne();

    res.json({ msg: "Opportunity deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;