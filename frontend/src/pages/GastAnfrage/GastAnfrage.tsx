// 📁 frontend/src/pages/GastAnfrage.tsx
// 🇩🇪 Alle Kommentare sind auf Deutsch

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutocompletePLZ from "@/components/autocomplete/AutocompletePLZ";
import AutocompleteStrasse from "@/components/autocomplete/AutocompleteStrasse";
import "./GastAnfrage.css";

// ✅ Props für die Straßen-Autocomplete-Komponente
interface AutocompleteStrasseProps {
  plzOrtId: number | null;
  onStrasseSelected: (strasse: string) => void;
}

// 🧾 Typdefinitionen
interface Bundesland { id: number; name: string; }
interface Region { id: number; name: string; }
interface ServiceType { id: number; name: string; category: string; }

const GastAnfrage: React.FC = () => {
  const navigate = useNavigate();

  // 🧾 Formular-Zustände
  const [bundeslaender, setBundeslaender] = useState<Bundesland[]>([]);
  const [regionen, setRegionen] = useState<Region[]>([]);
  const [alleServices, setAlleServices] = useState<ServiceType[]>([]);

  const [land, setLand] = useState("");
  const [region, setRegion] = useState("");

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [firmenname, setFirmenname] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [plzOrtId, setPlzOrtId] = useState<number | null>(null);
  const [strasse, setStrasse] = useState("");
  const [hausnummer, setHausnummer] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [beschreibung, setBeschreibung] = useState("");
  const [bilder, setBilder] = useState<File[]>([]);

  // 💬 UI-Meldungen
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // 🌍 Bundesländer laden
  useEffect(() => {
    fetch("http://localhost:8000/api/bundeslaender/")
      .then((res) => res.json())
      .then((data) => setBundeslaender(data))
      .catch(() => setMessage("❌ Fehler beim Laden der Bundesländer."));
  }, []);

  // 🧭 Regionen für gewähltes Bundesland laden
  useEffect(() => {
    if (!land) return;
    fetch(`http://localhost:8000/api/regionen/?bundesland=${land}`)
      .then((res) => res.json())
      .then((data) => setRegionen(data))
      .catch(() => setMessage("❌ Fehler beim Laden der Regionen."));
  }, [land]);

  // 🔄 Leistungen laden
  useEffect(() => {
    fetch("http://localhost:8000/api/services/")
      .then((res) => res.json())
      .then((data) => setAlleServices(data))
      .catch(() => setMessage("❌ Fehler beim Laden der Leistungen."));
  }, []);

  // 📌 Icon je Kategorie
  const getIconForCategory = (category: string): string => {
    switch (category) {
      case "Umweltfachplanung": return "📐";
      case "Ökologische Erfassung": return "🦋";
      case "Umweltmanagement": return "🌱";
      case "Naturschutzberatung": return "🌿";
      case "Erneuerbare Energien": return "⚡";
      default: return "🔹";
    }
  };

  // ✅ Checkbox-Auswahl
  const handleCheckboxChange = (dienst: string) => {
    setServices((prev) =>
      prev.includes(dienst) ? prev.filter((s) => s !== dienst) : [...prev, dienst]
    );
  };

  // 📤 Bilder-Upload
  const handleBildUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setBilder((prev) => [...prev, ...Array.from(files)]);
  };

  const handleBildEntfernen = (index: number) => {
    setBilder((prev) => prev.filter((_, i) => i !== index));
  };

  // 📬 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gastEmail = localStorage.getItem("gast_email");
    const token = localStorage.getItem("gast_token");

    if (!gastEmail || !token) {
      setMessage("❌ Keine gültige GAST-E-Mail gefunden.");
      return;
    }

    if (
      !vorname || !nachname || !telefon || !firmenname ||
      !strasse || !hausnummer || !plz || !stadt || !land || !region ||
      services.length === 0
    ) {
      setMessage("❌ Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    const formData = new FormData();
    formData.append("email", gastEmail);
    formData.append("token", token);
    formData.append("vorname", vorname);
    formData.append("nachname", nachname);
    formData.append("telefon", telefon);
    formData.append("firmenname", firmenname);
    formData.append("strasse", strasse);
    formData.append("hausnummer", hausnummer);
    formData.append("plz", plz);
    formData.append("stadt", stadt);
    formData.append("land", land);
    formData.append("region", region);
    formData.append("beschreibung", beschreibung);
    services.forEach((id) => formData.append("services", id));
    bilder.forEach((bild) => formData.append("bilder", bild));

    try {
      const res = await fetch("http://localhost:8000/api/gast/request/", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // ✅ Erfolg: Formular leeren und auf Bestätigungsansicht umschalten
        setMessage("");
        setVorname(""); setNachname(""); setTelefon(""); setFirmenname("");
        setStrasse(""); setHausnummer(""); setLand(""); setRegion("");
        setPlz(""); setStadt(""); setBeschreibung(""); setServices([]); setBilder([]);
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage(err?.detail || "❌ Fehler beim Senden der Anfrage.");
      }
    } catch {
      setMessage("❌ Netzwerkfehler. Bitte später erneut versuchen.");
    }
  };

  // 🟢 Nach erfolgreichem Absenden: eigene Bestätigungsansicht (Formular ausgeblendet)
  if (showSuccess) {
    return (
      <div className="gast-anfrage-container">
        <section className="success-panel" role="status" aria-live="polite">
          <div className="success-icon" aria-hidden>✅</div>
          <h1 className="success-title">Vielen Dank für Ihre Anfrage!</h1>
          <p className="success-text">
            Ihre kostenlose Anfrage wurde <strong>erfolgreich übermittelt</strong>.
            Unser Team prüft Ihre Angaben und meldet sich in Kürze mit passenden Angeboten.
          </p>
          <p className="success-text subtle">
            Wenn Sie weitere Anfragen stellen und den vollen Funktionsumfang von <strong>ecoMatch</strong> nutzen möchten,
            erstellen Sie bitte ein Benutzerkonto. Die Registrierung dauert nur wenige Minuten.
          </p>

          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Jetzt registrieren
            </button>
            <button className="btn-ghost" onClick={() => navigate("/")}>
              Zur Startseite
            </button>
          </div>
        </section>
      </div>
    );
  }

  // 🧾 Standardansicht: Formular anzeigen
  return (
    <div className="gast-anfrage-container">
      <h2>📝 GAST-Anfrage stellen</h2>
      {message && <p className="nachricht">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* 👥 Ansprechpartner & 🏢 Firmendaten */}
        <div className="formular-oben">
          <div className="formular-block">
            <legend>👤 Ansprechpartner</legend>
            <label>
              Vorname*:
              <input value={vorname} onChange={(e) => setVorname(e.target.value)} />
            </label>
            <label>
              Nachname*:
              <input value={nachname} onChange={(e) => setNachname(e.target.value)} />
            </label>
            <label>
              Telefon*:
              <input value={telefon} onChange={(e) => setTelefon(e.target.value)} />
            </label>
          </div>

          <div className="formular-block">
            <legend>🏢 Firmendaten</legend>
            <label>
              Firmenname*:
              <input value={firmenname} onChange={(e) => setFirmenname(e.target.value)} />
            </label>
            <label>
              Bundesland*:
              <select
                value={land}
                onChange={(e) => { setLand(e.target.value); setRegion(""); }}
              >
                <option value="">Bitte wählen</option>
                {bundeslaender.map((l) => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>
            </label>
            <label>
              Region*:
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={!land}
              >
                <option value="">Bitte wählen</option>
                {regionen.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </label>

            {/* 📍 PLZ/Ort & Straße (abhängig) */}
            <AutocompletePLZ
              onPlzOrtSelected={(id, selectedPlz, selectedOrt) => {
                setPlz(selectedPlz);
                setStadt(selectedOrt);
                setPlzOrtId(id);
              }}
            />

            <AutocompleteStrasse
              plzOrtId={plzOrtId}
              onStrasseSelected={(value) => setStrasse(value)}
            />

            <label>
              Hausnummer*:
              <input value={hausnummer} onChange={(e) => setHausnummer(e.target.value)} />
            </label>
          </div>
        </div>

        {/* 🌿 Gewünschte Leistungen */}
        <fieldset>
          <legend>🌿 Gewünschte Leistungen*</legend>
          <div className="leistungen-grid">
            {Array.from(new Set(alleServices.map((s) => s.category))).map((category) => {
              const kategoriedienste = alleServices.filter((s) => s.category === category);
              const icon = getIconForCategory(category);
              return (
                <div key={category} className="leistung-kategorie">
                  <div className="kategorie-header">
                    <span>{icon}</span>
                    <strong>{category}</strong>
                  </div>
                  <div className="checkbox-liste">
                    {kategoriedienste.map((service) => (
                      <label key={service.id}>
                        <input
                          type="checkbox"
                          checked={services.includes(service.id.toString())}
                          onChange={() => handleCheckboxChange(service.id.toString())}
                        />
                        {service.name}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* 📝 Zusätzliche Hinweise */}
        <label>
          Zusätzliche Hinweise:
          <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} />
        </label>

        {/* 📷 Bilder vom Projektort */}
        <div className="bilder-upload">
          <label htmlFor="bilder-upload-btn" className="upload-label">
            📷 Bilder vom Projektort auswählen
          </label>
          <input
            id="bilder-upload-btn"
            type="file"
            multiple
            accept="image/*"
            onChange={handleBildUpload}
          />
          <div className="bilder-preview">
            {bilder.map((file, index) => (
              <div className="bild-container" key={index}>
                <img src={URL.createObjectURL(file)} alt={`Bild ${index + 1}`} />
                <button
                  type="button"
                  className="bild-entfernen-btn"
                  onClick={() => handleBildEntfernen(index)}
                  aria-label="Bild entfernen"
                  title="Bild entfernen"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Absenden */}
        <div className="submit-container">
          <button type="submit">✅ Anfrage absenden</button>
        </div>
      </form>
    </div>
  );
};

export default GastAnfrage;
