// 📁 src/pages/User/RequestsSection/RequestForm.tsx
// 🇩🇪 Vollständiges Anfrage-Formular im verschiebbaren Modal-Fenster

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "@/api/axios";
import AutocompletePLZ from "@/components/autocomplete/AutocompletePLZ";
import AutocompleteStrasse from "@/components/autocomplete/AutocompleteStrasse";
import ImageUploader from "@/components/upload/ImageUploader";
import "./RequestForm.css";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}
interface Bundesland { id: number; name: string; }
interface Region { id: number; name: string; }
interface ServiceType { id: number; name: string; category: string; }

const RequestForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  // 🪟 Fensterzustand (Position, Dragging, Min/Max)
  const winRef = useRef<HTMLDivElement>(null);
  const [isMin, setIsMin] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - 480,
    y: window.innerHeight / 2 - 300,
  });
  const [drag, setDrag] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const startDrag = (e: React.MouseEvent) => {
    if (isMax) return;
    setDrag(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag || isMax || !winRef.current) return;
      const w = winRef.current.offsetWidth;
      const h = winRef.current.offsetHeight;
      const nx = Math.min(Math.max(e.clientX - dragOffset.current.x, 0), window.innerWidth - w);
      const ny = Math.min(Math.max(e.clientY - dragOffset.current.y, 0), window.innerHeight - h);
      setPos({ x: nx, y: ny });
    };
    const onUp = () => setDrag(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, isMax]);

  // 📑 Formularzustände
  const [bundeslaender, setBundeslaender] = useState<Bundesland[]>([]);
  const [regionen, setRegionen] = useState<Region[]>([]);
  const [alleServices, setAlleServices] = useState<ServiceType[]>([]);
  const [landId, setLandId] = useState<number | null>(null);
  const [land, setLand] = useState("");
  const [regionId, setRegionId] = useState<number | null>(null);
  const [region, setRegion] = useState("");
  const [title, setTitle] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [plzOrtId, setPlzOrtId] = useState<number | null>(null);
  const [strasse, setStrasse] = useState("");
  const [hausnummer, setHausnummer] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [bilder, setBilder] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Daten laden
  useEffect(() => {
    axios.get("/bundeslaender/").then((r) => setBundeslaender(r.data));
    axios.get("/services/").then((r) => setAlleServices(r.data));
  }, []);
  useEffect(() => {
    if (!landId) {
      setRegionen([]);
      return;
    }
    axios.get(`/regionen/?bundesland=${landId}`).then((r) => setRegionen(r.data));
  }, [landId]);

  // 🗂️ Kategorien + Icons
  const kategorien = useMemo(
    () => Array.from(new Set(alleServices.map((s) => s.category))),
    [alleServices]
  );
  const icon = (c: string) =>
    c === "Umweltfachplanung" ? "📐" :
    c === "Ökologische Erfassung" ? "🦋" :
    c === "Umweltmanagement" ? "🌱" :
    c === "Naturschutzberatung" ? "🌿" :
    c === "Erneuerbare Energien" ? "⚡" : "🔹";

  const toggleService = (id: string) =>
    setServices((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // 💾 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("beschreibung", beschreibung);
    fd.append("plz", plz);
    fd.append("stadt", stadt);
    fd.append("strasse", strasse);
    fd.append("hausnummer", hausnummer);
    fd.append("land", land);
    fd.append("region", region);
    services.forEach((id) => fd.append("service_ids", id));
    bilder.forEach((b) => fd.append("images", b, b.name));
    try {
      setLoading(true);
      await axios.post("/requests/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  ref={winRef}
  className={`modal-window ${isMax ? "maximized" : ""}`}
  style={
    isMax
      ? { top: 60, left: 114, width: "90vw", height: "94vh", position: "fixed" }
      : { left: 650, top: 65, width: "960px", height: "82vh", position: "fixed" }
  }
>

      {/* 🔝 Fenster-Kopfzeile */}
      <div className="modal-header" onMouseDown={startDrag}>
        <span>Neue Anfrage</span>
        <div className="window-actions">
          <button type="button" onClick={() => setIsMax((m) => !m)}>☐</button>
          <button type="button" onClick={onClose}>✕</button>
        </div>
      </div>

      {/* 📑 Formular */}
      <form className="request-form" onSubmit={handleSubmit}>
        <div className="modal-body">
          {!isMin && (
            <>
              {/* Titel + Beschreibung */}
              <label>
                Titel*:
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>

              <label>
                Beschreibung:
                <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} />
              </label>

              {/* Zwei-Spalten-Layout: Ansprechpartner & Adresse */}
              <div className="form-sections">
                {/* 👤 Ansprechpartner */}
                <div className="form-section">
                  <h3>👤 Ansprechpartner</h3>
                  <label>Vorname*: <input type="text" /></label>
                  <label>Nachname*: <input type="text" /></label>
                  <label>Telefon*: <input type="tel" /></label>
                  <label>Firmenname*: <input type="text" /></label>
                </div>

                {/* 🏢 Adresse */}
                <div className="form-section">
                  <h3>🏢 Adresse</h3>
                  <label>
                    Bundesland*:
                    <select
                      value={landId ?? ""}
                      onChange={(e) => {
                        const id = e.target.value ? Number(e.target.value) : null;
                        setLandId(id);
                        const name = id ? (bundeslaender.find((b) => b.id === id)?.name ?? "") : "";
                        setLand(name);
                        setRegionId(null);
                        setRegion("");
                      }}
                    >
                      <option value="">Bitte wählen</option>
                      {bundeslaender.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Region*:
                    <select
                      value={regionId ?? ""}
                      onChange={(e) => {
                        const rid = e.target.value ? Number(e.target.value) : null;
                        setRegionId(rid);
                        const rName = rid ? (regionen.find((r) => r.id === rid)?.name ?? "") : "";
                        setRegion(rName);
                      }}
                      disabled={!landId}
                    >
                      <option value="">Bitte wählen</option>
                      {regionen.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </label>

                  <AutocompletePLZ onPlzOrtSelected={(id, p, o) => { setPlz(p); setStadt(o); setPlzOrtId(id); }} />
                  <AutocompleteStrasse plzOrtId={plzOrtId} onStrasseSelected={setStrasse} />

                  <label>
                    Hausnummer*:
                    <input value={hausnummer} onChange={(e) => setHausnummer(e.target.value)} />
                  </label>
                </div>
              </div>

              {/* 🌿 Leistungen */}
              <fieldset>
                <legend>🌿 Gewünschte Leistungen*</legend>
                <div className="leistungen-grid">
                  {kategorien.map((cat) => (
                    <div key={cat} className="leistung-kategorie">
                      <div className="kategorie-header">
                        <span>{icon(cat)}</span><strong>{cat}</strong>
                      </div>
                      <div className="checkbox-liste">
                        {alleServices.filter((s) => s.category === cat).map((s) => (
                          <label key={s.id}>
                            <span className="svc-name">{s.name}</span>
                            <input
                              type="checkbox"
                              checked={services.includes(s.id.toString())}
                              onChange={() => toggleService(s.id.toString())}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* 📷 Bilder */}
              <fieldset>
                <legend>🖼️ Bilder</legend>
                <ImageUploader value={bilder} onChange={setBilder} maxFiles={12} maxSizeMB={8} />
              </fieldset>
            </>
          )}
        </div>

        {/* ⬇️ Footer mit Buttons */}
        {!isMin && (
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Speichern…" : "✔ Anfrage absenden"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RequestForm;
