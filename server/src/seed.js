import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Event from "./models/Event.js";
import Promoter from "./models/Promoter.js";
import User from "./models/User.js";

dotenv.config();

const banners = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1571266028243-d220c6a7edbf?auto=format&fit=crop&w=1400&q=80"
];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Promoter.deleteMany({})]);

  const password = await bcrypt.hash("password123", 10);
  await User.create([
    { name: "Admin", phone: "9999999999", password, role: "admin" },
    { name: "Aarav Promoter", phone: "8888888888", password, role: "promoter" },
    { name: "Demo User", phone: "7777777777", password, role: "user" }
  ]);

  await Promoter.create({ name: "Aarav Promoter", phone: "8888888888", referral_code: "AARAV100" });

  const now = Date.now();
  await Event.create([
    {
      name: "Midnight Bollywood Social",
      venue_name: "Terra Mayaa",
      city: "Guwahati",
      date_time: new Date(now + 6 * 60 * 60 * 1000),
      description: "A polished Bollywood night with guestlist-first entry and city skyline energy.",
      banner_url: banners[0],
      music_tags: ["Bollywood", "Hip Hop"],
      crowd_tags: ["Premium Crowd", "College Crowd"],
      entry_type: "paid",
      live_status: "high_rush",
      is_trending: true
    },
    {
      name: "Warehouse Techno Friday",
      venue_name: "Kitty Ko",
      city: "Delhi",
      date_time: new Date(now + 8 * 60 * 60 * 1000),
      description: "Deep techno, tight curation and a late-night dancefloor built for serious music people.",
      banner_url: banners[1],
      music_tags: ["Techno"],
      crowd_tags: ["Premium Crowd"],
      entry_type: "couples_only",
      live_status: "almost_full",
      is_trending: true
    },
    {
      name: "Campus Takeover",
      venue_name: "Club XS",
      city: "Delhi",
      date_time: new Date(now + 30 * 60 * 60 * 1000),
      description: "Easy-entry student night with hip hop, Bollywood edits and group RSVP access.",
      banner_url: banners[2],
      music_tags: ["Hip Hop", "Bollywood"],
      crowd_tags: ["College Crowd"],
      entry_type: "free",
      live_status: "easy_entry",
      is_trending: false
    }
  ]);

  console.log("Seeded demo data");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
