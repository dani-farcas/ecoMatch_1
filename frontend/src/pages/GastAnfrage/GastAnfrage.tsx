// 📁 frontend/src/pages/GastAnfrage.tsx
// 🇩🇪 Alle Kommentare sind auf Deutsch

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AutocompletePLZ from "@/components/autocomplete/AutocompletePLZ";
import AutocompleteStrasse from "@/components/autocomplete/AutocompleteStrasse";
import ImageUploader from "@/components/upload/ImageUploader";

import "./GastAnfrage.css";

/* =========================================================
   Typdefinitionen für API-Objekte
   ========================================================= */
interface Bundesland {
  id: number;
  name: string;
}
interface Region {
  id: number;
  name: string;
}
interface ServiceType {
  id: number;
  name: string;
  category: string;
}

/* Optional: zentrale API-URL (bei Bedarf aus .env) */
const API_BASE = "http://localhost:8000/api";

/* =========================================================
   Seite: GastAnfrage
   ========================================================= */
const GastAnfrage: React.FC = () => {
  const navigate = useNavigate();

  // 📌 Container-Ref für gezieltes Scrollen nach oben
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔝 Hilfsfunktion: scrollt den Container (Fallback: window)
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ------------------------------
     Formularzustände (Kontrollen)
     ------------------------------ */
  const [bundeslaender, setBundeslaender] = useState<Bundesland[]>([]);
  const [regionen, setRegionen] = useState<Region[]>([]);
  const [alleServices, setAlleServices] = useState<ServiceType[]>([]);

  // Bundesland: wir halten sowohl ID (für Abfragen) als auch Name (für POST)
  const [landId, setLandId] = useState<number | null>(null);
  const [land, setLand] = useState<string>("");

  // Region analog (Name wird gepostet; ID optional für spätere Endpunkte)
  const [regionId, setRegionId] = useState<number | null>(null);
  const [region, setRegion] = useState<string>("");

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

  // Bilder (wird an ImageUploader gebunden)
  const [bilder, setBilder] = useState<File[]>([]);

  /* ------------------------------
     Meldungen (Benutzer-Feedback)
     ------------------------------ */
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");
  const [showSuccess, setShowSuccess] = useState(false);

  /* =========================================================
     Daten laden
     ========================================================= */

  // Bundesländer laden
  useEffect(() => {
    fetch(`${API_BASE}/bundeslaender/`)
      .then((res) => res.json())
      .then((data: Bundesland[]) => setBundeslaender(data))
      .catch(() => {
        setMessage("Fehler beim Laden der Bundesländer.");
        setMessageType("error");
        scrollToTop();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regionen laden (abhängig von Bundesland-ID)
  useEffect(() => {
    if (!landId) {
      setRegionen([]);
      return;
    }
    fetch(`${API_BASE}/regionen/?bundesland=${landId}`) // ← ID, nicht Name
      .then((res) => res.json())
      .then((data: Region[]) => setRegionen(data))
      .catch(() => {
        setMessage("Fehler beim Laden der Regionen.");
        setMessageType("error");
        scrollToTop();
      });
  }, [landId]);

  // Leistungen laden
  useEffect(() => {
    fetch(`${API_BASE}/services/`)
      .then((res) => res.json())
      .then((data: ServiceType[]) => setAlleServices(data))
      .catch(() => {
        setMessage("Fehler beim Laden der Leistungen.");
        setMessageType("error");
        scrollToTop();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     Hilfen / Utils
     ========================================================= */

  // Icon je Kategorie (nur UI)
  const getIconForCategory = (category: string): string => {
    switch (category) {
      case "Umweltfachplanung":
        return "📐";
      case "Ökologische Erfassung":
        return "🦋";
      case "Umweltmanagement":
        return "🌱";
      case "Naturschutzberatung":
        return "🌿";
      case "Erneuerbare Energien":
        return "⚡";
      default:
        return "🔹";
    }
  };

  // Kategorien sortiert/unique (Memo für Performance)
  const kategorien = useMemo(
    () => Array.from(new Set(alleServices.map((s) => s.category))),
    [alleServices]
  );

  // Checkbox-Auswahl toggeln
  const handleCheckboxChange = (dienstId: string) => {
    setServices((prev) =>
      prev.includes(dienstId)
        ? prev.filter((s) => s !== dienstId)
        : [...prev, dienstId]
    );
  };

  /* =========================================================
     Formular absenden
     ========================================================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gast-Tokens aus lokalem Speicher (Gast-Flow)
    const gastEmail = localStorage.getItem("gast_email");
    const token = localStorage.getItem("gast_token");

    if (!gastEmail || !token) {
      setMessage("Keine gültige GAST-E-Mail gefunden.");
      setMessageType("error");
      scrollToTop();
      return;
    }

    // Pflichtfelder prüfen (einfacher Frontend-Check)
    if (
      !vorname ||
      !nachname ||
      !telefon ||
      !firmenname ||
      !strasse ||
      !hausnummer ||
      !plz ||
      !stadt ||
      !land ||
      !region ||
      services.length === 0
    ) {
      setMessage("Bitte alle Pflichtfelder ausfüllen.");
      setMessageType("warning");
      scrollToTop();
      return;
    }

    // FormData für Multipart-POST (inkl. Bilder)
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

    // Für Backend-Logik: wir senden sprechende Namen (wie bisher genutzt)
    formData.append("land", land);
    formData.append("region", region);

    formData.append("beschreibung", beschreibung);
    services.forEach((id) => formData.append("services", id));
    bilder.forEach((bild) => formData.append("images", bild, bild.name));

    try {
      const res = await fetch(`${API_BASE}/gast/request/`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // Erfolg: Formular zurücksetzen und Erfolgsansicht zeigen
        setMessage(null);
        setVorname("");
        setNachname("");
        setTelefon("");
        setFirmenname("");
        setStrasse("");
        setHausnummer("");
        setLand("");
        setRegion("");
        setPlz("");
        setStadt("");
        setBeschreibung("");
        setServices([]);
        setBilder([]);
        setLandId(null);
        setRegionId(null);
        setShowSuccess(true);
        scrollToTop();
      } else {
        const err = await res.json().catch(() => ({} as any));
        setMessage(err?.detail || "Fehler beim Senden der Anfrage.");
        setMessageType("error");
        scrollToTop();
      }
    } catch {
      setMessage("Netzwerkfehler. Bitte später erneut versuchen.");
      setMessageType("error");
      scrollToTop();
    }
  };

  /* =========================================================
     Erfolgsansicht
     ========================================================= */
  if (showSuccess) {
    return (
      <div className="gast-anfrage-container" ref={containerRef}>
        <section className="success-panel" role="status" aria-live="polite">
          <div className="success-icon" aria-hidden>
            ✅
          </div>
          <h1 className="success-title">Vielen Dank für Ihre Anfrage!</h1>
          <p className="success-text">
            Ihre kostenlose Anfrage wurde <strong>erfolgreich übermittelt</strong>. Unser
            Team prüft Ihre Angaben und meldet sich in Kürze mit passenden Angeboten.
          </p>
          <p className="success-text subtle">
            Wenn Sie weitere Anfragen stellen und den vollen Funktionsumfang von{" "}
            <strong>ecoMatch</strong> nutzen möchten, erstellen Sie bitte ein Benutzerkonto.
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

  /* =========================================================
     Standardansicht (Formular)
     ========================================================= */
  return (
    <div className="gast-anfrage-container" ref={containerRef}>
      <h2>📝 GAST-Anfrage stellen</h2>

      {/* Sichtbare Meldung (nur wenn vorhanden) */}
      {message && (
        <p
          className={`alert ${
            messageType === "error"
              ? "alert-error"
              : messageType === "success"
              ? "alert-success"
              : messageType === "warning"
              ? "alert-warning"
              : "alert-info"
          }`}
          role="alert"
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* 👥 Ansprechpartner & 🏢 Firmendaten */}
        <div className="formular-oben">
          {/* linker Block: Ansprechpartner */}
          <div className="formular-block">
            <legend>👤 Ansprechpartner</legend>

            <label>
              Vorname*:
              <input
                value={vorname}
                onChange={(e) => setVorname(e.target.value)}
                autoComplete="given-name"
              />
            </label>

            <label>
              Nachname*:
              <input
                value={nachname}
                onChange={(e) => setNachname(e.target.value)}
                autoComplete="family-name"
              />
            </label>

            <label>
              Telefon*:
              <input
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
            </label>

            <label>
              Firmenname*:
              <input
                value={firmenname}
                onChange={(e) => setFirmenname(e.target.value)}
                autoComplete="organization"
              />
            </label>
          </div>

          {/* rechter Block: Adresse + Abhängigkeiten */}
          <div className="formular-block">
            <label>
              Bundesland*:
              <select
                value={landId ?? ""} // ← Kontrolle via ID
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setLandId(id); // ID für Abfragen
                  const name = id
                    ? bundeslaender.find((b) => b.id === id)?.name ?? ""
                    : "";
                  setLand(name); // Name für POST
                  setRegionId(null);
                  setRegion("");
                  setRegionen([]);
                }}
              >
                <option value="">Bitte wählen</option>
                {bundeslaender.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option> // value = ID
                ))}
              </select>
            </label>

            <label>
              Region*:
              <select
                value={regionId ?? ""} // optional via ID kontrolliert
                onChange={(e) => {
                  const rid = e.target.value ? Number(e.target.value) : null;
                  setRegionId(rid);
                  const rName = rid
                    ? regionen.find((r) => r.id === rid)?.name ?? ""
                    : "";
                  setRegion(rName);
                }}
                disabled={!landId}
              >
                <option value="">Bitte wählen</option>
                {regionen.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option> // value = ID
                ))}
              </select>
            </label>

            {/* 📍 PLZ/Ort (liefert plz, stadt, plzOrtId) */}
            <AutocompletePLZ
              onPlzOrtSelected={(id, selectedPlz, selectedOrt) => {
                setPlz(selectedPlz);
                setStadt(selectedOrt);
                setPlzOrtId(id);
              }}
            />

            {/* Straße (abhängig von plzOrtId) */}
            <AutocompleteStrasse
              plzOrtId={plzOrtId}
              onStrasseSelected={(value) => setStrasse(value)}
            />

            <label>
              Hausnummer*:
              <input
                value={hausnummer}
                onChange={(e) => setHausnummer(e.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
        </div>

        {/* 🌿 Gewünschte Leistungen – Text links, Checkbox rechts */}
        <fieldset>
          <legend>🌿 Gewünschte Leistungen*</legend>

          <div className="leistungen-grid">
            {kategorien.map((category) => {
              const icon = getIconForCategory(category);
              const kategoriedienste = alleServices.filter(
                (s) => s.category === category
              );

              return (
                <div key={category} className="leistung-kategorie">
                  <div className="kategorie-header">
                    <span>{icon}</span>
                    <strong>{category}</strong>
                  </div>

                  <div className="checkbox-liste">
                    {kategoriedienste.map((service) => (
                      <label key={service.id}>
                        <span>{service.name}</span>
                        <input
                          type="checkbox"
                          checked={services.includes(service.id.toString())}
                          onChange={() =>
                            handleCheckboxChange(service.id.toString())
                          }
                        />
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
          <textarea
            value={beschreibung}
            onChange={(e) => setBeschreibung(e.target.value)}
            placeholder="Projektumfang, Termine, Besonderheiten …"
          />
        </label>

        {/* 🖼️ Bilder – moderner Uploader (ohne obere Zusatzbuttons) */}
        <fieldset className="formular-block">
          <legend>🖼️ Bilder vom Projektort auswählen</legend>
          <ImageUploader
            value={bilder}
            onChange={setBilder}
            maxFiles={12}
            maxSizeMB={8}
          />
        </fieldset>

        {/* ✅ Zwei Buttons: Abbrechen + Absenden */}
        <div className="submit-container">
          <button type="submit" className="btn primary">
            ✔ Anfrage absenden
          </button>
          <button type="button" className="btn cancel">
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
};

export default GastAnfrage;
