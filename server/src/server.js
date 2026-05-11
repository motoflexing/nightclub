import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { isDemoMode } from "./config/demoStore.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import promoterRoutes from "./routes/promoterRoutes.js";
import rsvpRoutes from "./routes/rsvpRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

process.env.JWT_SECRET =
  process.env.JWT_SECRET || "local-demo-secret-change-before-deploy";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) =>
  res.json({ message: "Nightlife Platform API" })
);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/promoters", promoterRoutes);
app.use("/api/upload", uploadRoutes);

const port = process.env.PORT || 5000;

const start = async () => {
  if (isDemoMode()) {
    console.log(
      "No MONGODB_URI found. Running API with in-memory demo data."
    );
  } else {
    await connectDB();
  }
};

start()
  .then(() =>
    app.listen(port, () =>
      console.log(`Server running on port ${port}`)
    )
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
