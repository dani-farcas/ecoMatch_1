// 📁 frontend/src/components/autocomplete/AutocompleteStrasse.tsx

import React, { useState, useEffect } from "react";
import "./AutocompleteStrasse.css"; // 🎨 Externe CSS-Datei

// 🔧 Props vom übergeordneten Formular
interface AutocompleteStrasseProps {
  plzOrtId: number | null;
  onStrasseSelected: (strasse: string) => void;
}

const AutocompleteStrasse: React.FC<AutocompleteStrasseProps> = ({
  plzOrtId,
  onStrasseSelected,
}) => {
  const [strassen, setStrassen] = useState<string[]>([]);
  const [eingabe, setEingabe] = useState("");
  const [gefiltert, setGefiltert] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 📦 Lade Straßen vom Backend basierend auf PLZ-Ort-ID
  useEffect(() => {
    if (!plzOrtId) return;
    fetch(`http://localhost:8000/api/strassen/?plz_ort=${plzOrtId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.strassen)) {
          console.log("📦 Straßen geladen:", data.strassen);
          setStrassen(data.strassen);
        } else {
          console.error("❌ Unerwartetes Datenformat:", data);
        }
      })
      .catch((err) => {
        console.error("❌ Fehler beim Laden der Straßen:", err);
        setStrassen([]);
      });
  }, [plzOrtId]);

  // 🔍 Filtere Vorschläge basierend auf Eingabe
  useEffect(() => {
    const result = strassen.filter((s) =>
      s.toLowerCase().startsWith(eingabe.toLowerCase())
    );
    setGefiltert(result);
  }, [eingabe, strassen]);

  // 📌 Auswahl einer Straße
  const handleSelect = (strasse: string) => {
    setEingabe(strasse);
    setShowDropdown(false);
    onStrasseSelected(strasse);
  };

  return (
    <div className="strasse-autocomplete">
      <label htmlFor="strasse_input" className="strasse-label">
        Straße*
      </label>

      {/* 🛑 Unsichtbares Fake-Feld zum Blockieren von Browser-Autofill */}
      <input
        type="text"
        name="fake-strasse"
        autoComplete="address-line1"
        style={{
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
          opacity: 0,
        }}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* ✅ Echtes Eingabefeld mit deaktiviertem Autofill */}
      <input
        type="text"
        id="strasse_input"
        name="strasse_input_custom"
        autoComplete="new-password" // 🧠 verhindert Autofill in Chrome
        className="strasse-input"
        placeholder="Straßenname eingeben..."
        value={eingabe}
        onChange={(e) => {
          setEingabe(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />

      {/* 🔽 Dropdown mit Vorschlägen */}
      {showDropdown && gefiltert.length > 0 && (
        <ul className="strasse-dropdown">
          {gefiltert.map((strasse, idx) => (
            <li
              key={idx}
              className="strasse-item"
              onClick={() => handleSelect(strasse)}
              onMouseDown={(e) => e.preventDefault()} // verhindert Blur
            >
              {strasse}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteStrasse;
