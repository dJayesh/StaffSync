import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon, initials } from "./ui";

export default function Layout({ items, active, onChange, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const current = items.find((i) => i.key === active);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand"><span className="brand-mark">S</span><span className="brand-name">StaffSync</span></div>
        <nav aria-label="Main">
          {items.map((i) => (
            <button key={i.key} className={`nav-item ${active === i.key ? "active" : ""}`}
              onClick={() => { onChange(i.key); setOpen(false); }}>
              <Icon name={i.icon} />{i.label}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <div className="avatar">{initials(user.name)}</div>
          <div><strong>{user.name}</strong><small>{user.role}{user.department ? `, ${user.department}` : ""}</small></div>
          <button className="icon-btn" title="Sign out" aria-label="Sign out" onClick={() => { logout(); navigate("/login"); }}>
            <Icon name="logout" />
          </button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn" aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" /></button>
          <span className="crumb">{current?.label}</span>
          <span className="role-chip">{user.role}</span>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
