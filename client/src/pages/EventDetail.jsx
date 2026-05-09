import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Clock, MapPin, Share2, Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function EventDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/events/${id}`).then(setEvent).catch((error) => setMessage(error.message));
  }, [id]);

  const shareUrl = useMemo(() => `${window.location.origin}/events/${id}${params.get("ref") ? `?ref=${params.get("ref")}` : ""}`, [id, params]);

  async function rsvp() {
    try {
      const data = await api("/rsvps", {
        method: "POST",
        body: JSON.stringify({ event_id: id, ref: params.get("ref") })
      });
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!event) return <div className="page"><p>{message || "Loading event..."}</p></div>;

  return (
    <div className="page detail">
      <img className="detail-banner" src={event.banner_url} alt={event.name} />
      <div className="detail-grid">
        <section>
          <p className="eyebrow">{event.city} nightlife</p>
          <h1>{event.name}</h1>
          <p className="lead">{event.description}</p>
          <div className="meta">
            <span><MapPin size={18} /> {event.venue_name}</span>
            <span><Clock size={18} /> {new Date(event.date_time).toLocaleString()}</span>
          </div>
          <div className="vibes">
            {[...event.music_tags, ...event.crowd_tags].map((tag) => <span className="chip" key={tag}>{tag}</span>)}
          </div>
        </section>
        <aside className="panel">
          <span className={`status ${event.live_status}`}>{event.live_status.replace("_", " ")}</span>
          <h2>Guestlist access</h2>
          <p>Entry type: <strong>{event.entry_type.replace("_", " ")}</strong></p>
          {user ? <button className="button full" onClick={rsvp}><Ticket size={18} /> RSVP now</button> : <Link className="button full" to="/login">Login to RSVP</Link>}
          <button className="ghost full" onClick={() => navigator.clipboard.writeText(shareUrl)}><Share2 size={18} /> Copy link</button>
          {message && <p className="notice">{message}</p>}
        </aside>
      </div>
    </div>
  );
}
