import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  date: String,
  duration: String,
  image: String,
  status: {
    type: String,
    default: "Open"
  }
}, { timestamps: true });

export default mongoose.model("Opportunity", opportunitySchema);