import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const emptyEvent = {
  name: "",
  venue_name: "",
  city: "Guwahati",
  date_time: "",
  description: "",
  banner_url: "",
  music_tags: "Bollywood",
  crowd_tags: "Premium Crowd",
  entry_type: "free",
  live_status: "easy_entry",
  is_trending: false
};

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [promoterForm, setPromoterForm] = useState({ name: "", phone: "", referral_code: "" });
  const [filters, setFilters] = useState({ event: "", promoter: "" });
  const [message, setMessage] = useState("");

  function load() {
    api("/events").then(setEvents);
    api("/promoters").then(setPromoters);
    api(`/rsvps/admin?${new URLSearchParams(filters)}`).then(setRsvps);
  }

  useEffect(load, [filters.event, filters.promoter]);

  async function saveEvent(event) {
    event.preventDefault();
    const payload = {
      ...form,
      music_tags: form.music_tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      crowd_tags: form.crowd_tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    };
    if (editingId) await api(`/events/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
    else await api("/events", { method: "POST", body: JSON.stringify(payload) });
    setForm(emptyEvent);
    setEditingId(null);
    setMessage("Event saved");
    load();
  }

  async function uploadBanner(file) {
    const body = new FormData();
    body.append("banner", file);
    const data = await api("/upload/banner", { method: "POST", body });
    setForm({ ...form, banner_url: data.url });
  }

  async function createPromoter(event) {
    event.preventDefault();
    await api("/promoters", { method: "POST", body: JSON.stringify(promoterForm) });
    setPromoterForm({ name: "", phone: "", referral_code: "" });
    load();
  }

  async function generateCode() {
    const data = await api(`/promoters/generate-code?name=${encodeURIComponent(promoterForm.name || "NIGHT")}`);
    setPromoterForm({ ...promoterForm, referral_code: data.referral_code });
  }

  function editEvent(item) {
    setEditingId(item._id);
    setForm({
      ...item,
      date_time: item.date_time.slice(0, 16),
      music_tags: item.music_tags.join(", "),
      crowd_tags: item.crowd_tags.join(", ")
    });
  }

  return (
    <div className="page admin">
      <div className="section-head"><div><p className="eyebrow">Admin panel</p><h1>Operations dashboard</h1></div></div>
      {message && <p className="notice">{message}</p>}

      <section className="admin-grid">
        <form className="panel form" onSubmit={saveEvent}>
          <h2>{editingId ? "Edit event" : "Create event"}</h2>
          <input placeholder="Event name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Venue name" value={form.venue_name} onChange={(e) => setForm({ ...form, venue_name: e.target.value })} />
          <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}><option>Guwahati</option><option>Delhi</option></select>
          <input type="datetime-local" value={form.date_time} onChange={(e) => setForm({ ...form, date_time: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Banner URL" value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadBanner(e.target.files[0])} />
          <input placeholder="Music tags comma separated" value={form.music_tags} onChange={(e) => setForm({ ...form, music_tags: e.target.value })} />
          <input placeholder="Crowd tags comma separated" value={form.crowd_tags} onChange={(e) => setForm({ ...form, crowd_tags: e.target.value })} />
          <select value={form.entry_type} onChange={(e) => setForm({ ...form, entry_type: e.target.value })}><option value="free">Free</option><option value="paid">Paid</option><option value="couples_only">Couples only</option></select>
          <select value={form.live_status} onChange={(e) => setForm({ ...form, live_status: e.target.value })}><option value="high_rush">High Rush</option><option value="easy_entry">Easy Entry</option><option value="almost_full">Almost Full</option></select>
          <label className="check"><input type="checkbox" checked={form.is_trending} onChange={(e) => setForm({ ...form, is_trending: e.target.checked })} /> Trending</label>
          <button className="button full">Save event</button>
        </form>

        <div className="panel">
          <h2>Manage promoters</h2>
          <form className="mini-form" onSubmit={createPromoter}>
            <input placeholder="Name" value={promoterForm.name} onChange={(e) => setPromoterForm({ ...promoterForm, name: e.target.value })} />
            <input placeholder="Phone" value={promoterForm.phone} onChange={(e) => setPromoterForm({ ...promoterForm, phone: e.target.value })} />
            <input placeholder="Referral code" value={promoterForm.referral_code} onChange={(e) => setPromoterForm({ ...promoterForm, referral_code: e.target.value })} />
            <button type="button" className="ghost full" onClick={generateCode}>Generate referral code</button>
            <button className="button full">Add promoter</button>
          </form>
          <div className="list compact">
            {promoters.map((promoter) => (
              <div className="row between" key={promoter._id}>
                <span>{promoter.name} · {promoter.referral_code}</span>
                <button className="ghost" onClick={() => api(`/promoters/${promoter._id}`, { method: "PUT", body: JSON.stringify({ is_active: !promoter.is_active }) }).then(load)}>{promoter.is_active ? "Deactivate" : "Activate"}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Events</h2>
        </div>
        <div className="list">
          {events.map((event) => (
            <div className="panel row between" key={event._id}>
              <span>{event.name} · {event.city} · {event.live_status.replace("_", " ")}</span>
              <div className="actions"><button className="ghost" onClick={() => editEvent(event)}>Edit</button><button className="ghost" onClick={() => api(`/events/${event._id}`, { method: "DELETE" }).then(load)}>Deactivate</button></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>RSVP dashboard</h2>
          <div className="actions">
            <select value={filters.event} onChange={(e) => setFilters({ ...filters, event: e.target.value })}><option value="">All events</option>{events.map((event) => <option value={event._id} key={event._id}>{event.name}</option>)}</select>
            <select value={filters.promoter} onChange={(e) => setFilters({ ...filters, promoter: e.target.value })}><option value="">All promoters</option>{promoters.map((promoter) => <option value={promoter._id} key={promoter._id}>{promoter.name}</option>)}</select>
          </div>
        </div>
        <div className="list">
          {rsvps.map((rsvp) => (
            <div className="panel row between" key={rsvp._id}>
              <span>{rsvp.user_id?.name} · {rsvp.event_id?.name} · {rsvp.promoter_id?.referral_code || "direct"}</span>
              <span className="chip">{rsvp.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
