import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },

  wasteTypes: {
    type: [String],
    required: true
  },

  notes: String,

  // ✅ ADD THIS
  status: {
    type: String,
    default: "Open"
  }

},{ timestamps: true });

export default mongoose.model("Pickup", pickupSchema);