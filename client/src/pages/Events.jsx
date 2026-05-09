import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import { api } from "../services/api";

export default function Events() {
  const [city, setCity] = useState("");
  const [events, setEvents] = useState([]);
  const [params] = useSearchParams();
  const refCode = params.get("ref");

  useEffect(() => {
    api(`/events${city ? `?city=${city}` : ""}`).then(setEvents).catch(console.error);
  }, [city]);

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">All active nights</p>
          <h1>Event listing</h1>
        </div>
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">All cities</option>
          <option>Guwahati</option>
          <option>Delhi</option>
        </select>
      </div>
      <div className="grid cards">{events.map((event) => <EventCard key={event._id} event={event} refCode={refCode} />)}</div>
    </div>
  );
}
