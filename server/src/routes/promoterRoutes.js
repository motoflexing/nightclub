import express from "express";
import { createPromoter, generateReferralCode, listPromoters, updatePromoter } from "../controllers/promoterController.js";
import { allowRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin"), listPromoters);
router.post("/", protect, allowRoles("admin"), createPromoter);
router.put("/:id", protect, allowRoles("admin"), updatePromoter);
router.get("/generate-code", protect, allowRoles("admin"), generateReferralCode);

export default router;
