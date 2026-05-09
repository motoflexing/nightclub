import mongoose from "mongoose";

const promoterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  referral_code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Promoter", promoterSchema);
