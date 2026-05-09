import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  venue_name: { type: String, required: true, trim: true },
  city: { type: String, enum: ["Guwahati", "Delhi"], required: true },
  date_time: { type: Date, required: true },
  description: { type: String, required: true },
  banner_url: { type: String, required: true },
  music_tags: [{ type: String, trim: true }],
  crowd_tags: [{ type: String, trim: true }],
  entry_type: { type: String, enum: ["free", "paid", "couples_only"], default: "free" },
  live_status: { type: String, enum: ["high_rush", "easy_entry", "almost_full"], default: "easy_entry" },
  is_trending: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", eventSchema);
