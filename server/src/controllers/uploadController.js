import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import { isDemoMode } from "../config/demoStore.js";

export async function uploadBanner(req, res) {
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  if (isDemoMode() || !process.env.CLOUDINARY_CLOUD_NAME) {
    return res.json({
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
    });
  }

  const upload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "nightlife-platform", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  try {
    const result = await upload();
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
}
