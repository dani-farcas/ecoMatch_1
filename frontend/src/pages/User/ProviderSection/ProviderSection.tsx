// 📁 src/pages/User/ProviderSection/ProviderSection.tsx
// 🇩🇪 Provider-Dashboard: zeigt passende Anfragen und erlaubt Akzeptieren

import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { CheckCircle, MapPin, Briefcase } from "lucide-react";
import "./ProviderSection.css";

interface Request {
  id: number;
  title: string;
  beschreibung?: string;
  status: string;
  created_at: string;
  services: { id: number; name: string }[];
  plz?: string;
  stadt?: string;
  region?: string;
  land?: string;
}

const ProviderSection: React.FC = () => {
  const [matches, setMatches] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("/provider/matches/");
        setMatches(res.data);
      } catch (err) {
        console.error("❌ Fehler beim Laden der Matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const acceptRequest = async (id: number) => {
    try {
      await axios.post(`/provider/${id}/accept/`);
      setMatches((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "akzeptiert" } : req
        )
      );
      alert("✅ Anfrage akzeptiert!");
    } catch (err) {
      console.error("❌ Fehler beim Akzeptieren:", err);
    }
  };

  if (loading) return <p>Lade passende Anfragen...</p>;

  return (
    <div className="provider-section">
      <h2>📋 Passende Anfragen</h2>
      {matches.length === 0 ? (
        <p className="empty">Keine passenden Anfragen gefunden.</p>
      ) : (
        <div className="request-list">
          {matches.map((req) => (
            <div key={req.id} className="request-card">
              <h3>{req.title}</h3>
              <p className="meta">
                <Briefcase size={16} />{" "}
                {req.services.map((s) => s.name).join(", ")}
              </p>
              <p className="meta">
                <MapPin size={16} /> {req.plz} {req.stadt} ({req.region})
              </p>
              <p className="status">Status: {req.status}</p>
              <button
                className="accept-btn"
                onClick={() => acceptRequest(req.id)}
                disabled={req.status === "akzeptiert"}
              >
                <CheckCircle size={18} /> Akzeptieren
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderSection;
