import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Music2, Sparkles } from "lucide-react";

const statusLabels = {
  high_rush: "High Rush",
  easy_entry: "Easy Entry",
  almost_full: "Almost Full"
};

export default function EventCard({ event, refCode }) {
  const href = `/events/${event._id}${refCode ? `?ref=${refCode}` : ""}`;

  return (
    <article className="event-card">
      <img src={event.banner_url} alt={event.name} />
      <div className="event-body">
        <div className="row between">
          <span className={`status ${event.live_status}`}>{statusLabels[event.live_status]}</span>
          {event.is_trending && <span className="chip hot"><Sparkles size={14} /> Trending</span>}
        </div>
        <h3>{event.name}</h3>
        <p><MapPin size={16} /> {event.venue_name}, {event.city}</p>
        <p><Music2 size={16} /> {[...(event.music_tags || []), ...(event.crowd_tags || [])].slice(0, 3).join(" • ")}</p>
        <div className="row between">
          <span className="chip">{event.entry_type.replace("_", " ")}</span>
          <Link className="button small" to={href}>View</Link>
        </div>
      </div>
    </article>
  );
}
