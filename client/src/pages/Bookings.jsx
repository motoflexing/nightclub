import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api("/rsvps/mine").then(setBookings).catch(console.error);
  }, []);

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Your guestlists</p>
          <h1>My bookings</h1>
        </div>
      </div>
      <div className="list">
        {bookings.map((booking) => (
          <div className="panel booking" key={booking._id}>
            <img src={booking.event_id.banner_url} alt={booking.event_id.name} />
            <div>
              <h3>{booking.event_id.name}</h3>
              <p>{booking.event_id.venue_name}, {booking.event_id.city}</p>
              <span className="chip">{booking.status}</span>
            </div>
          </div>
        ))}
        {!bookings.length && <p className="muted">No RSVPs yet.</p>}
      </div>
    </div>
  );
}
