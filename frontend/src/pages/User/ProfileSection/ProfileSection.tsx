// 📁 src/pages/User/ProfileSection/ProfileSection.tsx
import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import "./ProfileSection.css";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  telefon?: string;
  firma?: string;
  land?: number;
  region?: number;
  plz?: string;
  stadt?: string;
  strasse?: string;
  hausnummer?: string;
  ueber_mich?: string;
}

const ProfileSection: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get("/users/me/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Fehler beim Laden:", err));
  }, []);

  if (!user) return <p>Lade Profil...</p>;

  return (
    <div className="profile-section">
      {editMode ? (
        <ProfileEdit user={user} setUser={setUser} onCancel={() => setEditMode(false)} />
      ) : (
        <ProfileView user={user} onEdit={() => setEditMode(true)} />
      )}
    </div>
  );
};

export default ProfileSection;
