import { demoStore, isDemoMode, makeId } from "../config/demoStore.js";
import Event from "../models/Event.js";

export async function listEvents(req, res) {
  if (isDemoMode()) {
    const { city, trending } = req.query;
    const events = demoStore.events
      .filter((event) => event.is_active)
      .filter((event) => !city || event.city === city)
      .filter((event) => trending !== "true" || event.is_trending)
      .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
    return res.json(events);
  }

  const { city, trending } = req.query;
  const filter = { is_active: true };
  if (city) filter.city = city;
  if (trending === "true") filter.is_trending = true;

  const events = await Event.find(filter).sort({ date_time: 1 });
  res.json(events);
}

export async function getEvent(req, res) {
  if (isDemoMode()) {
    const event = demoStore.events.find((item) => item._id === req.params.id && item.is_active);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  }

  const event = await Event.findById(req.params.id);
  if (!event || !event.is_active) return res.status(404).json({ message: "Event not found" });
  res.json(event);
}

export async function createEvent(req, res) {
  if (isDemoMode()) {
    const event = { _id: makeId("e"), ...req.body, is_active: true, createdAt: new Date() };
    demoStore.events.push(event);
    return res.status(201).json(event);
  }

  const event = await Event.create(req.body);
  res.status(201).json(event);
}

export async function updateEvent(req, res) {
  if (isDemoMode()) {
    const index = demoStore.events.findIndex((event) => event._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Event not found" });
    demoStore.events[index] = { ...demoStore.events[index], ...req.body };
    return res.json(demoStore.events[index]);
  }

  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
}

export async function deleteEvent(req, res) {
  if (isDemoMode()) {
    const event = demoStore.events.find((item) => item._id === req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.is_active = false;
    return res.json({ message: "Event deactivated" });
  }

  const event = await Event.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deactivated" });
}
