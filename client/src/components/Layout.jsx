import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity, Camera, CarFront, ChartNoAxesCombined, CircleUserRound,
  Film, History as HistoryIcon, LogOut, Menu, Radio, ShieldAlert,
  TrafficCone, X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Command Center", icon: Activity, end: true },
  { to: "/image-detection", label: "Image Detection", icon: Camera },
  { to: "/manual-control", label: "Manual Control", icon: TrafficCone },
  { to: "/simulation", label: "Live Simulation", icon: Radio },
  { to: "/video-analysis", label: "Video Analysis", icon: Film },
  { to: "/history", label: "Activity History", icon: HistoryIcon }
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><CarFront size={25} /></div>
          <div>
            <strong>SMART<span>TRAFFIC</span></strong>
            <small>AI CONTROL CENTER</small>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}><X /></button>
        </div>

        <div className="operator-card">
          <div className="avatar"><CircleUserRound /></div>
          <div>
            <b>{user?.name || "Operator"}</b>
            <small>Control Operator</small>
          </div>
          <span className="online-dot" />
        </div>

        <nav>
          <small className="nav-caption">MONITORING</small>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status"><span /> All systems operational</div>
          <button className="logout-btn" onClick={signOut}><LogOut size={18} /> Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setOpen(true)}><Menu /></button>
          <div className="topbar-title">
            <span className="live-pill"><i /> LIVE</span>
            <span>Traffic Intelligence Network</span>
          </div>
          <div className="topbar-right">
            <ShieldAlert size={17} />
            <span>AI monitoring active</span>
          </div>
        </header>
        <div className="page-wrap"><Outlet /></div>
      </main>
    </div>
  );
}
