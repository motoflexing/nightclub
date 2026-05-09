import React from "react";
import { Link, NavLink } from "react-router-dom";
import { CalendarDays, LogOut, Shield, Ticket, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="nav">
      <Link to="/" className="brand">Nightlife Platform</Link>
      <nav>
        <NavLink to="/events"><CalendarDays size={17} /> Events</NavLink>
        <NavLink to="/bookings"><Ticket size={17} /> My bookings</NavLink>
        {user?.role === "promoter" && <NavLink to="/promoter"><Users size={17} /> Promoter</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin"><Shield size={17} /> Admin</NavLink>}
      </nav>
      {user ? (
        <button className="ghost" onClick={logout}><LogOut size={17} /> {user.name}</button>
      ) : (
        <Link className="button small" to="/login">Login</Link>
      )}
    </header>
  );
}
