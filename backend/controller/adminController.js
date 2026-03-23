import User from "../model/user.js";
import Opportunity from "../model/opportunity.js";
import ActivityLog from "../model/activitylog.js";
import Stats from "../model/stats.js";

// ================= USER MANAGEMENT =================

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend / Activate User
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isVerified = !user.isVerified; // Using isVerified as a proxy for 'active' or adding a new status field
    await user.save();

    await ActivityLog.create({
      user: req.user.name,
      action: user.isVerified ? "Activated User" : "Suspended User",
      value: 1
    });

    res.json({ msg: `User status updated to ${user.isVerified ? 'Active' : 'Suspended'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= OPPORTUNITY MODERATION =================

// Delete inappropriate opportunity
export const deleteOpportunityAdmin = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ msg: "Opportunity not found" });

    await opportunity.deleteOne();

    await ActivityLog.create({
      user: req.user.name,
      action: "Deleted Opportunity (Admin)",
      value: 1
    });

    res.json({ msg: "Opportunity removed by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REPORTING & ANALYTICS =================

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });
    const totalOpportunities = await Opportunity.countDocuments();
    
    // Aggregation for applications status
    const applicationStats = await Opportunity.aggregate([
      { $unwind: "$applicants" },
      { $group: { _id: "$applicants.status", count: { $sum: 1 } } }
    ]);

    // Aggregation for waste categories
    const wasteStats = await Opportunity.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } }
    ]);

    // Platform Stats
    const totalPickups = await Stats.findOne();
    const totalNGOs = await User.countDocuments({ role: "ngo" });

    res.json({
      totalUsers,
      activeUsers,
      totalNGOs,
      totalOpportunities,
      applicationStats,
      wasteStats,
      pickups: totalPickups
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View logs
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
