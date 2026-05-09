import React, { useEffect, useMemo, useState } from "react";
import { Copy, MessageCircle } from "lucide-react";
import { api } from "../services/api";

export default function PromoterDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api("/rsvps/promoter/stats").then(setStats).catch(console.error);
  }, []);

  const link = useMemo(() => {
    if (!stats?.promoter) return "";
    return `${window.location.origin}/events?ref=${stats.promoter.referral_code}`;
  }, [stats]);

  if (!stats) return <div className="page"><p>Loading promoter dashboard...</p></div>;

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Promoter console</p>
          <h1>{stats.promoter.name}</h1>
        </div>
      </div>
      <div className="metrics">
        <div className="panel"><span>Total RSVPs</span><strong>{stats.totalRsvps}</strong></div>
        <div className="panel"><span>Today's RSVPs</span><strong>{stats.todayRsvps}</strong></div>
        <div className="panel"><span>Earnings</span><strong>₹{stats.earnings}</strong></div>
      </div>
      <div className="panel">
        <h2>Referral code: {stats.promoter.referral_code}</h2>
        <div className="actions">
          <button className="button" onClick={() => navigator.clipboard.writeText(link)}><Copy size={18} /> Copy referral link</button>
          <a className="ghost" href={`https://wa.me/?text=${encodeURIComponent(`RSVP here: ${link}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp share</a>
        </div>
      </div>
      <section>
        <h2>Event-wise RSVPs</h2>
        <div className="list">
          {stats.eventWiseRsvps.map((item) => (
            <div className="panel row between" key={item._id}>
              <span>{item.event.name} · {item.event.venue_name}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
