export function isDemoMode() {
  return !process.env.MONGODB_URI;
}

const now = Date.now();

export const demoStore = {
  users: [
    { _id: "u_admin", name: "Admin", phone: "9999999999", password: "password123", role: "admin", createdAt: new Date() },
    { _id: "u_promoter", name: "Aarav Promoter", phone: "8888888888", password: "password123", role: "promoter", createdAt: new Date() },
    { _id: "u_user", name: "Demo User", phone: "7777777777", password: "password123", role: "user", createdAt: new Date() }
  ],
  promoters: [
    { _id: "p_aarav", name: "Aarav Promoter", phone: "8888888888", referral_code: "AARAV100", is_active: true, createdAt: new Date() }
  ],
  events: [
    {
      _id: "e_guwahati_bollywood",
      name: "Midnight Bollywood Social",
      venue_name: "Terra Mayaa",
      city: "Guwahati",
      date_time: new Date(now + 6 * 60 * 60 * 1000).toISOString(),
      description: "A polished Bollywood night with guestlist-first entry and city skyline energy.",
      banner_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
      music_tags: ["Bollywood", "Hip Hop"],
      crowd_tags: ["Premium Crowd", "College Crowd"],
      entry_type: "paid",
      live_status: "high_rush",
      is_trending: true,
      is_active: true,
      createdAt: new Date()
    },
    {
      _id: "e_delhi_techno",
      name: "Warehouse Techno Friday",
      venue_name: "Kitty Ko",
      city: "Delhi",
      date_time: new Date(now + 8 * 60 * 60 * 1000).toISOString(),
      description: "Deep techno, tight curation and a late-night dancefloor built for serious music people.",
      banner_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80",
      music_tags: ["Techno"],
      crowd_tags: ["Premium Crowd"],
      entry_type: "couples_only",
      live_status: "almost_full",
      is_trending: true,
      is_active: true,
      createdAt: new Date()
    },
    {
      _id: "e_delhi_campus",
      name: "Campus Takeover",
      venue_name: "Club XS",
      city: "Delhi",
      date_time: new Date(now + 30 * 60 * 60 * 1000).toISOString(),
      description: "Easy-entry student night with hip hop, Bollywood edits and group RSVP access.",
      banner_url: "https://images.unsplash.com/photo-1571266028243-d220c6a7edbf?auto=format&fit=crop&w=1400&q=80",
      music_tags: ["Hip Hop", "Bollywood"],
      crowd_tags: ["College Crowd"],
      entry_type: "free",
      live_status: "easy_entry",
      is_trending: false,
      is_active: true,
      createdAt: new Date()
    }
  ],
  rsvps: []
};

export function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function withoutPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
