import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { demoStore, isDemoMode, makeId, withoutPassword } from "../config/demoStore.js";
import User from "../models/User.js";

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function sendUser(res, user) {
  res.json({
    token: createToken(user),
    user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
  });
}

export async function signup(req, res) {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone and password are required" });
    }

    if (isDemoMode()) {
      const exists = demoStore.users.find((user) => user.phone === phone);
      if (exists) return res.status(409).json({ message: "Phone already registered" });

      const user = { _id: makeId("u"), name, phone, password, role: "user", createdAt: new Date() };
      demoStore.users.push(user);
      return sendUser(res, user);
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hash, role: "user" });
    sendUser(res, user);
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
}

export async function login(req, res) {
  try {
    const { phone, password } = req.body;
    if (isDemoMode()) {
      const user = demoStore.users.find((item) => item.phone === phone);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid phone or password" });
      }
      return sendUser(res, user);
    }

    const user = await User.findOne({ phone });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid phone or password" });
    }

    sendUser(res, user);
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
}

export function me(req, res) {
  res.json({ user: withoutPassword(req.user) });
}
