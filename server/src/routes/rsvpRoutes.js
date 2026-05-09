import express from "express";
import { adminRsvps, createRsvp, myRsvps, promoterStats } from "../controllers/rsvpController.js";
import { allowRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createRsvp);
router.get("/mine", protect, myRsvps);
router.get("/admin", protect, allowRoles("admin"), adminRsvps);
router.get("/promoter/stats", protect, allowRoles("promoter", "admin"), promoterStats);

export default router;
