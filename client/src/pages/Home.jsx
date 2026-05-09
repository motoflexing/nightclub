import React, { useEffect, useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import { api } from "../services/api";

const vibes = ["Bollywood", "Techno", "Hip Hop", "Premium Crowd", "College Crowd"];

export default function Home() {
  const [city, setCity] = useState("Guwahati");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api(`/events?city=${city}`).then(setEvents).catch(console.error);
  }, [city]);

  const tonight = useMemo(() => events.slice(0, 3), [events]);
  const trending = useMemo(() => events.filter((event) => event.is_trending), [events]);

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Guwahati and Delhi guestlists</p>
          <h1>Find tonight's best room before the door gets tight.</h1>
          <p className="hero-copy">RSVP to premium nightlife events, track promoter referrals, and manage live crowd status from one focused platform.</p>
          <div className="segmented">
            {["Guwahati", "Delhi"].map((item) => (
              <button key={item} className={city === item ? "active" : ""} onClick={() => setCity(item)}>{item}</button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Tonight in {city}</h2>
          <span>{tonight.length} live picks</span>
        </div>
        <div className="grid cards">{tonight.map((event) => <EventCard key={event._id} event={event} />)}</div>
      </section>

      <section>
        <div className="section-head">
          <h2>Trending</h2>
          <span>Fast-moving guestlists</span>
        </div>
        <div className="grid cards">{trending.map((event) => <EventCard key={event._id} event={event} />)}</div>
      </section>

      <section>
        <div className="section-head">
          <h2>Browse by vibe</h2>
          <span>Music and crowd filters</span>
        </div>
        <div className="vibes">
          {vibes.map((vibe) => <span className="vibe" key={vibe}>{vibe}</span>)}
        </div>
      </section>
    </div>
  );
}
