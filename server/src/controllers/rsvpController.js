import { demoStore, isDemoMode, makeId } from "../config/demoStore.js";
import Event from "../models/Event.js";
import Promoter from "../models/Promoter.js";
import Rsvp from "../models/Rsvp.js";

const RSVP_VALUE = 100;

export async function createRsvp(req, res) {
  try {
    const { event_id, ref } = req.body;
    if (isDemoMode()) {
      const event = demoStore.events.find((item) => item._id === event_id && item.is_active);
      if (!event) return res.status(404).json({ message: "Event not found" });

      const duplicate = demoStore.rsvps.find((rsvp) => rsvp.user_id === req.user._id && rsvp.event_id === event_id);
      if (duplicate) return res.status(409).json({ message: "You already RSVP'd for this event" });

      const promoter = ref
        ? demoStore.promoters.find((item) => item.referral_code === ref.toUpperCase() && item.is_active)
        : null;
      const rsvp = {
        _id: makeId("r"),
        user_id: req.user._id,
        event_id,
        promoter_id: promoter?._id || null,
        status: "pending",
        createdAt: new Date()
      };
      demoStore.rsvps.push(rsvp);
      return res.status(201).json({ message: "RSVP confirmed. You're on the list.", rsvp });
    }

    const event = await Event.findById(event_id);
    if (!event || !event.is_active) return res.status(404).json({ message: "Event not found" });

    const duplicate = await Rsvp.findOne({ user_id: req.user._id, event_id });
    if (duplicate) return res.status(409).json({ message: "You already RSVP'd for this event" });

    let promoter = null;
    if (ref) {
      promoter = await Promoter.findOne({ referral_code: ref.toUpperCase(), is_active: true });
    }

    const rsvp = await Rsvp.create({
      user_id: req.user._id,
      event_id,
      promoter_id: promoter?._id || null
    });

    res.status(201).json({ message: "RSVP confirmed. You're on the list.", rsvp });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already RSVP'd for this event" });
    }
    res.status(500).json({ message: "Could not create RSVP" });
  }
}

export async function myRsvps(req, res) {
  if (isDemoMode()) {
    const rsvps = demoStore.rsvps
      .filter((rsvp) => rsvp.user_id === req.user._id)
      .map((rsvp) => ({ ...rsvp, event_id: demoStore.events.find((event) => event._id === rsvp.event_id) }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(rsvps);
  }

  const rsvps = await Rsvp.find({ user_id: req.user._id }).populate("event_id").sort({ createdAt: -1 });
  res.json(rsvps);
}

export async function adminRsvps(req, res) {
  if (isDemoMode()) {
    const { event, promoter } = req.query;
    const rsvps = demoStore.rsvps
      .filter((rsvp) => !event || rsvp.event_id === event)
      .filter((rsvp) => !promoter || rsvp.promoter_id === promoter)
      .map((rsvp) => ({
        ...rsvp,
        user_id: demoStore.users.find((user) => user._id === rsvp.user_id),
        event_id: demoStore.events.find((item) => item._id === rsvp.event_id),
        promoter_id: demoStore.promoters.find((item) => item._id === rsvp.promoter_id) || null
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(rsvps);
  }

  const { event, promoter } = req.query;
  const filter = {};
  if (event) filter.event_id = event;
  if (promoter) filter.promoter_id = promoter;

  const rsvps = await Rsvp.find(filter)
    .populate("user_id", "name phone")
    .populate("event_id", "name venue_name city date_time")
    .populate("promoter_id", "name referral_code")
    .sort({ createdAt: -1 });

  res.json(rsvps);
}

export async function promoterStats(req, res) {
  if (isDemoMode()) {
    const promoter = demoStore.promoters.find((item) => item.phone === req.user.phone);
    if (!promoter) return res.status(404).json({ message: "Promoter profile not found" });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const promoterRsvps = demoStore.rsvps.filter((rsvp) => rsvp.promoter_id === promoter._id);
    const eventWiseRsvps = demoStore.events
      .map((event) => ({
        _id: event._id,
        event: { name: event.name, city: event.city, venue_name: event.venue_name },
        count: promoterRsvps.filter((rsvp) => rsvp.event_id === event._id).length
      }))
      .filter((item) => item.count > 0);

    return res.json({
      promoter,
      totalRsvps: promoterRsvps.length,
      todayRsvps: promoterRsvps.filter((rsvp) => new Date(rsvp.createdAt) >= start).length,
      earnings: promoterRsvps.length * RSVP_VALUE,
      fixedValue: RSVP_VALUE,
      eventWiseRsvps
    });
  }

  const promoter = await Promoter.findOne({ phone: req.user.phone });
  if (!promoter) return res.status(404).json({ message: "Promoter profile not found" });

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [total, today, byEvent] = await Promise.all([
    Rsvp.countDocuments({ promoter_id: promoter._id }),
    Rsvp.countDocuments({ promoter_id: promoter._id, createdAt: { $gte: start } }),
    Rsvp.aggregate([
      { $match: { promoter_id: promoter._id } },
      { $group: { _id: "$event_id", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      { $project: { count: 1, event: { name: "$event.name", city: "$event.city", venue_name: "$event.venue_name" } } }
    ])
  ]);

  res.json({
    promoter,
    totalRsvps: total,
    todayRsvps: today,
    earnings: total * RSVP_VALUE,
    fixedValue: RSVP_VALUE,
    eventWiseRsvps: byEvent
  });
}
