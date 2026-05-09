import express from "express";
import multer from "multer";
import { uploadBanner } from "../controllers/uploadController.js";
import { allowRoles, protect } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

router.post("/banner", protect, allowRoles("admin"), upload.single("banner"), uploadBanner);

export default router;
