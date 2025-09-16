// 📁 src/pages/User/ProfileSection/ProfileEdit.tsx
// Formular zur Bearbeitung des Benutzerprofils mit vollständiger Adresslogik.

import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react"; // Icons moderne
import AutocompletePLZ from "@/components/autocomplete/AutocompletePLZ";
import AutocompleteStrasse from "@/components/autocomplete/AutocompleteStrasse";
import "./ProfileEdit.css";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  telefon?: string;
  firma?: string;
  land?: number;
  region?: number;
  plz?: string;
  stadt?: string;
  strasse?: string;
  hausnummer?: string;
  ueber_mich?: string;
}

interface Props {
  user: User;
  setUser: (u: User) => void;
  onCancel: () => void;
}

interface Bundesland {
  id: number;
  name: string;
}
interface Region {
  id: number;
  name: string;
}

const ProfileEdit: React.FC<Props> = ({ user, setUser, onCancel }) => {
  const [vorname, setVorname] = useState(user.first_name || "");
  const [nachname, setNachname] = useState(user.last_name || "");
  const [telefon, setTelefon] = useState(user.telefon || "");
  const [firma, setFirma] = useState(user.firma || "");
  const [ueberMich, setUeberMich] = useState(user.ueber_mich || "");

  const [land, setLand] = useState<number | "">(user.land ?? "");
  const [region, setRegion] = useState<number | "">(user.region ?? "");

  const [plz, setPlz] = useState(user.plz || "");
  const [stadt, setStadt] = useState(user.stadt || "");
  const [strasse, setStrasse] = useState(user.strasse || "");
  const [hausnummer, setHausnummer] = useState(user.hausnummer || "");

  const [profilBild, setProfilBild] = useState<string | null>(
    user.profile_image || null
  );
  const [neuesBild, setNeuesBild] = useState<File | null>(null);

  const [bundeslaender, setBundeslaender] = useState<Bundesland[]>([]);
  const [regionen, setRegionen] = useState<Region[]>([]);
  const [message, setMessage] = useState("");

  const [plzOrtId, setPlzOrtId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/bundeslaender/")
      .then((res) => res.json())
      .then((data) => setBundeslaender(data))
      .catch(() => setMessage("Fehler beim Laden der Bundesländer."));
  }, []);

  useEffect(() => {
    if (!land) return;
    fetch(`http://localhost:8000/api/regionen/?bundesland=${land}`)
      .then((res) => res.json())
      .then((data) => setRegionen(data))
      .catch(() => setMessage("Fehler beim Laden der Regionen."));
  }, [land]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", vorname);
      formData.append("last_name", nachname);

      // Backend-Feldnamen verwenden
      formData.append("phone_number", telefon);
      formData.append("company", firma);
      formData.append("ueber_mich", ueberMich);

      if (land) formData.append("land", String(land));
      if (region) formData.append("region", String(region));

      formData.append("postal_code", plz);
      formData.append("city", stadt);
      formData.append("street", strasse);
      formData.append("house_number", hausnummer);

      if (neuesBild) {
        formData.append("profile_image", neuesBild);
      } else if (profilBild === null) {
        formData.append("profile_image", "");
      }

      const res = await fetch("http://localhost:8000/api/users/me/", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setMessage("Profil erfolgreich gespeichert.");
        onCancel();
      } else {
        setMessage("Fehler beim Speichern des Profils.");
      }
    } catch {
      setMessage("Netzwerkfehler.");
    }
  };

  // Funktion: Initialen aus Vor- und Nachname berechnen
  const getInitialen = () => {
    const v = vorname ? vorname.charAt(0).toUpperCase() : "";
    const n = nachname ? nachname.charAt(0).toUpperCase() : "";
    return v + n || "?";
  };

  return (
    <div className="profile-edit">
      <h2>Profil bearbeiten</h2>
      {message && <p className="status">{message}</p>}

      <div className="profilbild-block">
        <div className="profilbild-container">
          {profilBild ? (
            <img
              src={profilBild}
              alt="Profilbild"
              className="profilbild-preview"
            />
          ) : (
            <div className="profilbild-placeholder">{getInitialen()}</div>
          )}

          {/* Upload-Icon */}
          <label className="avatar-action avatar-upload">
            <Upload size={16} />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNeuesBild(file);
                  setProfilBild(URL.createObjectURL(file));
                }
              }}
            />
          </label>

          {/* Remove-Icon */}
          {profilBild && (
            <button
              type="button"
              className="avatar-action avatar-remove"
              onClick={() => {
                setProfilBild(null);
                setNeuesBild(null);
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="formular-block">
          <label>Vorname*</label>
          <input value={vorname} onChange={(e) => setVorname(e.target.value)} />

          <label>Nachname*</label>
          <input
            value={nachname}
            onChange={(e) => setNachname(e.target.value)}
          />

          <label>Telefon*</label>
          <input value={telefon} onChange={(e) => setTelefon(e.target.value)} />

          <label>Firma*</label>
          <input value={firma} onChange={(e) => setFirma(e.target.value)} />
        </div>

        <div className="formular-block">
          <label>Bundesland*</label>
          <select
            value={land}
            onChange={(e) => setLand(Number(e.target.value))}
          >
            <option value="">Bitte wählen</option>
            {bundeslaender.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <label>Region*</label>
          <select
            value={region}
            onChange={(e) => setRegion(Number(e.target.value))}
            disabled={!land}
          >
            <option value="">Bitte wählen</option>
            {regionen.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <AutocompletePLZ
            onPlzOrtSelected={(id, selectedPlz, selectedOrt) => {
              if (selectedPlz !== plz || selectedOrt !== stadt) {
                setStrasse("");
              }
              setPlz(selectedPlz);
              setStadt(selectedOrt);
              setPlzOrtId(id);
            }}
          />

          <AutocompleteStrasse
            plzOrtId={plzOrtId}
            onStrasseSelected={(value) => setStrasse(value)}
          />

          <label>Hausnummer*</label>
          <input
            value={hausnummer}
            onChange={(e) => setHausnummer(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <label>Über mich</label>
        <textarea
          value={ueberMich}
          onChange={(e) => setUeberMich(e.target.value)}
          placeholder="Freitext über Sie oder Ihr Unternehmen..."
        />
      </div>

      <div className="actions">
        <button onClick={handleSave}>Speichern</button>
        <button onClick={onCancel} className="cancel-btn">
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
