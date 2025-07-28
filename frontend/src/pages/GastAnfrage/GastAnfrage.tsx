// 📁 frontend/src/pages/GastAnfrage.tsx

import React, { useState } from "react";
import "./GastAnfrage.css";

// 🌍 Mapping: Land → Regionen
const landRegionMap: Record<string, string[]> = {
  Hessen: ["Gießen", "Marburg-Biedenkopf", "Lahn-Dill", "Wetteraukreis"],
  Bayern: ["München", "Nürnberg", "Augsburg"],
  NRW: ["Köln", "Düsseldorf", "Dortmund"],
};

const landOptions = Object.keys(landRegionMap);

// 🗂️ Dienstleistungskategorien + Unterpunkte
const dienstKategorien = [
  {
    titel: "Umweltfachplanung",
    icon: "📐",
    unterpunkte: [
      "Landschaftsplanung",
      "Bauleitplanung",
      "Artenschutzprüfung",
      "Eingriffsregelung",
    ],
  },
  {
    titel: "Ökologische Erfassung",
    icon: "🦋",
    unterpunkte: [
      "Biotopkartierung",
      "Avifauna",
      "Reptilien",
      "Fledermäuse",
      "Vegetation",
    ],
  },
  {
    titel: "Umweltmanagement",
    icon: "🌱",
    unterpunkte: [
      "Monitoring",
      "Bauüberwachung",
      "Nachhaltigkeitskonzepte",
      "Berichtserstellung",
    ],
  },
  {
    titel: "Naturschutzberatung",
    icon: "🌿",
    unterpunkte: [
      "Pflegepläne",
      "Fördermittelberatung",
      "Kompensationsmaßnahmen",
      "Habitatsmanagement",
    ],
  },
  {
    titel: "Erneuerbare Energien",
    icon: "⚡",
    unterpunkte: [
      "Standortanalyse Solar",
      "Windkraftplanung",
      "Genehmigungsplanung",
      "Beteiligungsverfahren",
    ],
  },
];

const GastAnfrage: React.FC = () => {
  // 🔧 Formularfelder
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [firmenname, setFirmenname] = useState("");
  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [stadt, setStadt] = useState("");
  const [land, setLand] = useState("");
  const [region, setRegion] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [beschreibung, setBeschreibung] = useState("");
  const [message, setMessage] = useState("");

  const handleLandChange = (selected: string) => {
    setLand(selected);
    setRegion("");
  };

  const handleCheckboxChange = (dienst: string) => {
    setServices((prev) =>
      prev.includes(dienst)
        ? prev.filter((s) => s !== dienst)
        : [...prev, dienst]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validierung
    if (
      !vorname ||
      !nachname ||
      !telefon ||
      !firmenname ||
      !strasse ||
      !plz ||
      !stadt ||
      !land ||
      !region ||
      services.length === 0
    ) {
      setMessage("❌ Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    // 📤 Anfrage absenden
    const res = await fetch("http://localhost:8000/api/gast/request/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vorname,
        nachname,
        telefon,
        firmenname,
        strasse,
        plz,
        stadt,
        land,
        region,
        services,
        beschreibung,
      }),
    });

    setMessage(
      res.ok
        ? "✅ Anfrage erfolgreich gesendet."
        : "❌ Fehler beim Senden der Anfrage."
    );
  };

  return (
    <div className="gast-anfrage-container">
      <h2>📝 GAST-Anfrage stellen</h2>
      {message && <p className="nachricht">{message}</p>}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>👤 Ansprechpartner</legend>
          <label>Vorname*:
            <input type="text" value={vorname} onChange={(e) => setVorname(e.target.value)} />
          </label>
          <label>Nachname*:
            <input type="text" value={nachname} onChange={(e) => setNachname(e.target.value)} />
          </label>
          <label>Telefon*:
            <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} />
          </label>
        </fieldset>

        <fieldset>
          <legend>🏢 Firmendaten</legend>
          <label>Firmenname*:
            <input type="text" value={firmenname} onChange={(e) => setFirmenname(e.target.value)} />
          </label>
          <label>Straße und Hausnummer*:
            <input type="text" value={strasse} onChange={(e) => setStrasse(e.target.value)} />
          </label>
          <label>PLZ*:
            <input type="text" value={plz} onChange={(e) => setPlz(e.target.value)} />
          </label>
          <label>Stadt*:
            <input type="text" value={stadt} onChange={(e) => setStadt(e.target.value)} />
          </label>
          <label>Bundesland*:
            <select value={land} onChange={(e) => handleLandChange(e.target.value)}>
              <option value="">Bitte wählen</option>
              {landOptions.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>Region (Landkreis)*:
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={!land}
            >
              <option value="">Bitte wählen</option>
              {land &&
                landRegionMap[land]?.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>🌿 Gewünschte Leistungen*</legend>
          <div className="leistungen-grid">
            {dienstKategorien.map((kat) => (
              <div key={kat.titel} className="leistung-kategorie">
                <div className="kategorie-header">
                  <span>{kat.icon}</span>
                  <strong>{kat.titel}</strong>
                </div>
                <div className="checkbox-liste">
                  {kat.unterpunkte.map((up) => (
                    <label key={up}>
                      <input
                        type="checkbox"
                        checked={services.includes(up)}
                        onChange={() => handleCheckboxChange(up)}
                      />
                      {up}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <label>Zusätzliche Hinweise (optional):
          <textarea
            value={beschreibung}
            onChange={(e) => setBeschreibung(e.target.value)}
          />
        </label>

        <button type="submit">✅ Anfrage absenden</button>
      </form>
    </div>
  );
};

export default GastAnfrage;
