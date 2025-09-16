// 📁 frontend/src/components/autocomplete/AutocompleteStrasse.tsx

import React, { useState, useEffect, useRef } from "react";
import "./AutocompleteStrasse.css";

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
  const [activeIndex, setActiveIndex] = useState<number>(-1); // Index für Tastaturnavigation
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Straßen vom Backend laden
  useEffect(() => {
    if (!plzOrtId) return;
    fetch(`http://localhost:8000/api/strassen/?plz_ort=${plzOrtId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.strassen)) {
          setStrassen(data.strassen);
        } else {
          console.error("Unerwartetes Datenformat:", data);
        }
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Straßen:", err);
        setStrassen([]);
      });
  }, [plzOrtId]);

  // Filter aktualisieren
  useEffect(() => {
    const result = strassen.filter((s) =>
      s.toLowerCase().startsWith(eingabe.toLowerCase())
    );
    setGefiltert(result);
    setActiveIndex(-1); // Reset beim neuen Tippen
  }, [eingabe, strassen]);

  // Auswahl einer Straße
  const handleSelect = (strasse: string) => {
    setEingabe(strasse);
    setShowDropdown(false);
    onStrasseSelected(strasse);
  };

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // Tastatursteuerung
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || gefiltert.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % gefiltert.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? gefiltert.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(gefiltert[activeIndex]);
    }
  };

  return (
    <div className="strasse-autocomplete">
      <label htmlFor="strasse_input" className="strasse-label">
        Straße*
      </label>

      <input
        type="text"
        id="strasse_input"
        name="strasse_input_custom"
        autoComplete="new-password"
        className="strasse-input"
        placeholder="Straßenname eingeben..."
        value={eingabe}
        onChange={(e) => {
          setEingabe(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onKeyDown={handleKeyDown} // Tastaturevents
      />

      {showDropdown && gefiltert.length > 0 && (
        <ul className="strasse-dropdown">
          {gefiltert.map((strasse, idx) => (
            <li
              key={idx}
              ref={(el: HTMLLIElement | null) => {
                itemRefs.current[idx] = el;
              }}
              className={`strasse-item ${idx === activeIndex ? "active" : ""}`}
              onClick={() => handleSelect(strasse)}
              onMouseDown={(e) => e.preventDefault()}
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
