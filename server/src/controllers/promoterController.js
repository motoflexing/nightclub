import { demoStore, isDemoMode, makeId } from "../config/demoStore.js";
import Promoter from "../models/Promoter.js";
import User from "../models/User.js";

function makeCode(name = "NIGHT") {
  return `${name.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function listPromoters(req, res) {
  if (isDemoMode()) {
    return res.json([...demoStore.promoters].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }

  const promoters = await Promoter.find().sort({ createdAt: -1 });
  res.json(promoters);
}

export async function createPromoter(req, res) {
  const { name, phone, referral_code } = req.body;
  const code = referral_code || makeCode(name);
  if (isDemoMode()) {
    if (demoStore.promoters.some((promoter) => promoter.referral_code === code.toUpperCase())) {
      return res.status(409).json({ message: "Referral code already exists" });
    }
    const promoter = { _id: makeId("p"), name, phone, referral_code: code.toUpperCase(), is_active: true, createdAt: new Date() };
    demoStore.promoters.push(promoter);
    const user = demoStore.users.find((item) => item.phone === phone);
    if (user) user.role = "promoter";
    return res.status(201).json(promoter);
  }

  const promoter = await Promoter.create({ name, phone, referral_code: code });
  await User.findOneAndUpdate({ phone }, { role: "promoter" });
  res.status(201).json(promoter);
}

export async function updatePromoter(req, res) {
  if (isDemoMode()) {
    const index = demoStore.promoters.findIndex((promoter) => promoter._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Promoter not found" });
    demoStore.promoters[index] = { ...demoStore.promoters[index], ...req.body };
    return res.json(demoStore.promoters[index]);
  }

  const promoter = await Promoter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!promoter) return res.status(404).json({ message: "Promoter not found" });
  res.json(promoter);
}

export function generateReferralCode(req, res) {
  res.json({ referral_code: makeCode(req.query.name) });
}
