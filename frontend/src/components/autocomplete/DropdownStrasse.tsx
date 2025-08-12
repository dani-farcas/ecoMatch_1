import React, { useState, useEffect } from "react";

interface DropdownStrasseProps {
  plzOrtId: number | null;
  onStrasseSelected: (name: string) => void;
}

const DropdownStrasse: React.FC<DropdownStrasseProps> = ({
  plzOrtId,
  onStrasseSelected,
}) => {
  const [strassen, setStrassen] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setStrassen([]);
    setInput("");
    onStrasseSelected("");

    if (plzOrtId) {
      fetch(`http://localhost:8000/api/strassen/?plz_ort_id=${plzOrtId}`)
        .then((res) => res.json())
        .then((data) => {
          setStrassen(data.strassen || []);
        })
        .catch((err) => {
          console.error("❌ Fehler beim Laden der Straßen", err);
        });
    }
  }, [plzOrtId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onStrasseSelected(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Straßenname eingeben"
        list="strassen-liste"
        value={input}
        onChange={handleChange}
        disabled={!plzOrtId || strassen.length === 0}
      />
      <datalist id="strassen-liste">
        {strassen.map((name, index) => (
          <option key={index} value={name} />
        ))}
      </datalist>
    </>
  );
};

export default DropdownStrasse;
