import express from "express";
import upload from "../middleware/multer.js";
import { createOpportunity, updateOpportunity } from "../controller/dashboardController.js";
import Opportunity from "../model/opportunity.js";
import Notification from "../model/notification.js";
import User from "../model/user.js"; 
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("Opportunity routes loaded");

// ================= CREATE =================
// Admin & NGO can create
router.post(
  "/create",
  protect,
  authorizeRoles("ngo"),
  upload.single("image"),
  createOpportunity
);

// ================= GET ALL =================
// All logged-in users (Admin, NGO, Volunteer)
router.get("/", async (req, res) => {
  try {
    const data = await Opportunity.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= TOP MATCHES FOR VOLUNTEER =================
// Returns open opportunities scored by skills + location match
router.get("/matches/top", protect, authorizeRoles("volunteer"), async (req, res) => {
  try {
    // Fetch the logged-in volunteer's full profile
    const volunteer = await User.findById(req.user._id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Normalize volunteer data
    const volunteerLocation = (volunteer.location || "").trim().toLowerCase();

    // Skills can be stored as an array or as a comma-separated string
    let volunteerSkills = [];
    if (Array.isArray(volunteer.skills)) {
      volunteerSkills = volunteer.skills.map((s) => s.trim().toLowerCase()).filter(Boolean);
    } else if (typeof volunteer.skills === "string") {
      volunteerSkills = volunteer.skills
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }

    // Fetch only open opportunities
    const opportunities = await Opportunity.find({ status: "Open" });

    // Score each opportunity
    const scored = opportunities.map((opp) => {
      let score = 0;

      // --- Location match (2 points) ---
      const oppLocation = (opp.location || "").trim().toLowerCase();
      if (
        volunteerLocation &&
        oppLocation &&
        (oppLocation.includes(volunteerLocation) || volunteerLocation.includes(oppLocation))
      ) {
        score += 2;
      }

      // --- Skills match (1 point per matching skill) ---
      if (volunteerSkills.length > 0) {
        const oppText =
          `${opp.title || ""} ${opp.description || ""}`.toLowerCase();

        volunteerSkills.forEach((skill) => {
          if (skill && oppText.includes(skill)) {
            score += 1;
          }
        });
      }

      return { opportunity: opp, score };
    });

    // Filter out zero-score results and sort descending by score
    const topMatches = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6) // top 6
      .map((item) => ({ ...item.opportunity.toObject(), matchScore: item.score }));

    res.json(topMatches);
  } catch (err) {
    console.error("Matching error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Opportunity.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================= UPDATE =================
// Admin & NGO can update
router.put(
  "/:id",
  protect,
  authorizeRoles("ngo"),
  upload.single("image"),
  async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity)
        return res.status(404).json({ msg: "Opportunity not found" });

      // 🔐 If NGO → allow only if he created it
      if (
        req.user.role === "ngo" &&
        opportunity.createdBy &&
        opportunity.createdBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ msg: "Not authorized to edit this opportunity" });
      }

      const updated = await Opportunity.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          image: req.file
            ? `/uploads/${req.file.filename}`
            : opportunity.image,
        },
        { new: true }
      );

      res.json(updated);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ================= DELETE =================
// Admin & NGO can delete
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "ngo"),
  async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity)
        return res.status(404).json({ msg: "Opportunity not found" });

      // 🔐 NGO restriction
      if (
        req.user.role === "ngo" &&
        opportunity.createdBy &&
        opportunity.createdBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ msg: "Not authorized to delete this opportunity" });
      }

      await opportunity.deleteOne();

      res.json({ msg: "Opportunity deleted successfully" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Volunteer applies to an opportunity
router.post(
  "/apply/:id",
  protect,
  authorizeRoles("volunteer"),
  async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity)
        return res.status(404).json({ msg: "Opportunity not found" });

      const alreadyApplied = opportunity.applicants.some(
        (app) => app.user.toString() === req.user._id.toString()
      );

      if (alreadyApplied) {
        return res.status(400).json({ msg: "You have already applied" });
      }

      opportunity.applicants.push({
        user: req.user._id,
        status: "pending",
      });

      await opportunity.save();

      res.json({ success: true, msg: "Applied successfully" });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

// NGO Accept / Reject Application
router.put(
  "/application/:opportunityId/:userId",
  protect,
  authorizeRoles("ngo"),
  async (req, res) => {
    try {
      const { opportunityId, userId } = req.params;
      const { status } = req.body; // accepted or rejected

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ msg: "Invalid status" });
      }

      const opportunity = await Opportunity.findById(opportunityId);

      if (!opportunity)
        return res.status(404).json({ msg: "Opportunity not found" });

      // NGO can only manage their own opportunity
      if (opportunity.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "Not authorized" });
      }

      const applicant = opportunity.applicants.find(
        (app) => app.user.toString() === userId
      );

      if (!applicant)
        return res.status(404).json({ msg: "Applicant not found" });

      applicant.status = status;

      await opportunity.save();

      // Create Notification for volunteer
      await Notification.create({
        recipient: userId,
        sender: req.user._id,
        type: "opportunity_status",
        content: `Your application for "${opportunity.title}" has been ${status} by ${req.user.name}`,
        link: "/opportunities",
      });

      res.json({ success: true, opportunity });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

export default router;
