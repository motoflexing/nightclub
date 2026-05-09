import express from "express";
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from "../controllers/eventController.js";
import { allowRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", protect, allowRoles("admin"), createEvent);
router.put("/:id", protect, allowRoles("admin"), updateEvent);
router.delete("/:id", protect, allowRoles("admin"), deleteEvent);

export default router;
