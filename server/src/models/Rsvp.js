import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  promoter_id: { type: mongoose.Schema.Types.ObjectId, ref: "Promoter", default: null },
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

rsvpSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

export default mongoose.model("Rsvp", rsvpSchema);
