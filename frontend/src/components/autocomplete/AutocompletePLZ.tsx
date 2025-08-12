// 📁 components/autocomplete/AutocompletePLZ.tsx
import React, { useState, useEffect } from "react";

interface OrtEintrag {
  id: number;
  plz: string;
  ort: string;
}

interface AutocompletePLZProps {
  onPlzOrtSelected: (id: number, plz: string, ort: string) => void;
}

const AutocompletePLZ: React.FC<AutocompletePLZProps> = ({
  onPlzOrtSelected,
}) => {
  const [plz, setPlz] = useState("");
  const [orte, setOrte] = useState<OrtEintrag[]>([]);
  const [ausgewählt, setAusgewählt] = useState("");

  // 🔄 Lade Orte bei gültiger PLZ
  useEffect(() => {
    if (plz.length === 5) {
      fetch(`http://localhost:8000/api/plz/?plz=${plz}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setOrte(data);
            if (data.length === 1) {
              const eintrag = data[0];
              setAusgewählt(eintrag.ort);
              onPlzOrtSelected(eintrag.id, eintrag.plz, eintrag.ort);
            } else {
              setAusgewählt(""); // trebuie să aleagă manual
            }
          } else {
            setOrte([]);
          }
        })
        .catch(() => setOrte([]));
    } else {
      setOrte([]);
      setAusgewählt("");
    }
  }, [plz, onPlzOrtSelected]);

  const handleOrtSelect = (ort: string) => {
    setAusgewählt(ort);
    const eintrag = orte.find(
      (v) => v.ort.toLowerCase() === ort.toLowerCase().trim()
    );
    if (eintrag) {
      onPlzOrtSelected(eintrag.id, eintrag.plz, eintrag.ort);
    }
  };

  return (
    <div className="plz-autocomplete">
      <label>
        PLZ*:
        <input
          type="text"
          name="plz_input_custom"
          autoComplete="off"
          value={plz}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d{0,5}$/.test(val)) setPlz(val);
          }}
          placeholder="z. B. 60313"
        />
      </label>

      {orte.length > 0 && (
        <label>
          Ort auswählen*:
          <input
            type="text"
            name="ort_input_custom"
            autoComplete="off"
            value={ausgewählt}
            onChange={(e) => handleOrtSelect(e.target.value)}
            list="ortVorschlaege"
            onBlur={() => handleOrtSelect(ausgewählt)}
          />
          <datalist id="ortVorschlaege">
            {orte.map((v) => (
              <option key={v.id} value={v.ort} />
            ))}
          </datalist>
        </label>
      )}
    </div>
  );
};

export default AutocompletePLZ;
