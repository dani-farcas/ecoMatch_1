// 📁 src/pages/User/RequestsSection/RequestsSection.tsx
// 🇩🇪 Anzeige der Anfragen mit Suche, Gruppierung, Modal zum Erstellen und Detail-Modal per Doppelklick

import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Plus, Search } from "lucide-react";
import RequestForm from "./RequestForm";
import RequestDetail from "./RequestDetail"; // ➕ neue Komponente für Details
import "./RequestsSection.css";

interface Request {
  id: number;
  title: string;
  beschreibung: string;
  status: string;
  created_at: string;
  services: { id: number; name: string }[];
}

const RequestsSection: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // 🎯 Doppelklick → öffnet Detail-Modal
  const handleOpenRequest = (req: Request) => {
    setSelectedRequest(req);
  };

  // 📡 Daten vom Backend laden
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/requests/");
        setRequests(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Anfragen", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // 🔎 Lokale Suche
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(requests);
      return;
    }
    const lower = search.toLowerCase();
    setFiltered(
      requests.filter(
        (r) =>
          r.title.toLowerCase().includes(lower) ||
          r.beschreibung.toLowerCase().includes(lower) ||
          r.services.some((s) => s.name.toLowerCase().includes(lower))
      )
    );
  }, [search, requests]);

  // 📅 Gruppierung nach Jahr/Monat
  const grouped = filtered.reduce((acc: any, req) => {
    const date = new Date(req.created_at);
    const year = date.getFullYear();
    const month = date.toLocaleString("de-DE", { month: "long" });
    const key = `${year} ${month}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(req);
    return acc;
  }, {});

  return (
    <div className="requests-section">
      {/* 🔝 Header */}
      <div className="requests-header">
        <h2>📂 Meine Anfragen</h2>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📑 Inhalt */}
      {loading ? (
        <p>Lade...</p>
      ) : (
        <div className="requests-list">
          {Object.keys(grouped)
            .sort((a, b) => (a < b ? 1 : -1))
            .map((group) => (
              <div key={group} className="requests-group">
                <h3>{group}</h3>
                <div className="requests-cards">
                  {grouped[group].map((req: Request) => (
                    <div
                      key={req.id}
                      className="request-card"
                      onDoubleClick={() => handleOpenRequest(req)}
                    >
                      {/* 🇩🇪 Linke Seite: Titel + Datum */}
                      <div className="request-info">
                        <div className="request-icon">📄</div>
                        <div className="request-text">
                          <h4>{req.title}</h4>
                          <small>
                            {new Date(req.created_at).toLocaleDateString("de-DE")}
                          </small>
                        </div>
                      </div>

                      {/* 🇩🇪 Rechte Seite: Status */}
                      <div className="request-meta">
                        <span className="status-badge">{req.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ➕ Neue Anfrage */}
      <button className="new-request-btn" onClick={() => setShowModal(true)}>
        <Plus size={20} /> Neue Anfrage
      </button>

      {/* 🪟 Modal für Anfrage-Formular */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RequestForm
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                axios.get("/requests/").then((res) => setRequests(res.data));
              }}
            />
          </div>
        </div>
      )}

      {/* 🪟 Modal für Anfrage-Details */}
      {selectedRequest && (
        <RequestDetail
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default RequestsSection;
