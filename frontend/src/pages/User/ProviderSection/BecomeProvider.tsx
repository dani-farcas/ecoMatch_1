// 📁 src/pages/User/ProviderSection/BecomeProvider.tsx
// 🇩🇪 Formular, damit ein Client zum Anbieter werden kann

import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import "./BecomeProvider.css";

interface Props {
  onSuccess: () => void; // 🔥 Callback wenn Profil erstellt
}

interface ServiceType {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
  bundesland: string;
}

const BecomeProvider: React.FC<Props> = ({ onSuccess }) => {
  const [firma, setFirma] = useState("");
  const [services, setServices] = useState<ServiceType[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 🔄 Services & Regionen laden
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvRes, regRes] = await Promise.all([
          axios.get("/servicetypes/"),
          axios.get("/regionen/"),
        ]);
        setServices(srvRes.data);
        setRegions(regRes.data);
      } catch (err) {
        console.error("❌ Fehler beim Laden:", err);
      }
    };
    fetchData();
  }, []);

  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleRegion = (id: number) => {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/provider-profiles/", {
        firma,
        service_ids: selectedServices,
        coverage_region_ids: selectedRegions,
      });
      setSuccess("✅ Dein Anbieter-Profil wurde erstellt!");
      onSuccess(); // 🔥 UserDashboard informieren
    } catch (err) {
      console.error("❌ Fehler beim Erstellen:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="become-provider">
      <h2>🚀 Anbieter werden</h2>
      {success ? (
        <p className="success">{success}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Firmenname:
            <input
              type="text"
              value={firma}
              onChange={(e) => setFirma(e.target.value)}
              required
            />
          </label>

          <div className="section">
            <h3>Services</h3>
            <div className="grid">
              {services.map((srv) => (
                <label key={srv.id}>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(srv.id)}
                    onChange={() => toggleService(srv.id)}
                  />
                  {srv.name}
                </label>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Regionen</h3>
            <div className="grid">
              {regions.slice(0, 30).map((reg) => (
                <label key={reg.id}>
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(reg.id)}
                    onChange={() => toggleRegion(reg.id)}
                  />
                  {reg.name} ({reg.bundesland})
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Speichern..." : "Profil erstellen"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BecomeProvider;
