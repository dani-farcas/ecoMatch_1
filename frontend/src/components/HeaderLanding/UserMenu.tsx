// 🇩🇪 Dropdown-Menü für eingeloggte Nutzer (Avatar rechts oben)
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // ← existent la tine

import "./UserMenu.css";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 🇩🇪 Klick außerhalb schließt das Menü
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials =
    user?.initials ||
    `${(user?.first_name || "U")[0]}${(user?.last_name || "N")[0]}`.toUpperCase();

  const goDashboard = () =>
    navigate(user?.has_providerprofile ? "/dashboard/provider" : "/dashboard/client");

  return (
    <div className="umenu" ref={ref}>
      <button className="umenu-avatar" onClick={() => setOpen(!open)} aria-label="Nutzermenü">
        {user?.avatar_url ? <img src={user.avatar_url} alt="Avatar" /> : <span>{initials}</span>}
      </button>

      {open && (
        <div className="umenu-dropdown">
          <button onClick={goDashboard}>Dashboard</button>
          <button onClick={() => navigate("/profile/edit")}>Profil bearbeiten</button>
          <hr />
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
