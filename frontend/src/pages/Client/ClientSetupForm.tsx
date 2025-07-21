import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

import {
  FaSun,
  FaMoon,
  FaEdit,
  FaSave,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

const landkreiseMap: Record<string, string[]> = {
  Hessen: ["Gießen", "Marburg-Biedenkopf", "Offenbach"],
  Bayern: ["München", "Augsburg", "Nürnberg"],
  Berlin: ["Mitte", "Pankow", "Charlottenburg-Wilmersdorf"],
};

const ClientSetupForm: React.FC = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    institution_name: "",
    contact_person: "",
    contact_function: "",
    contact_phone: "",
    region: "",
    landkreis: "",
    stadt: "",
    plz: "",
    strasse_nr: "",
    über_mich: "",
    external_link: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [überMichCount, setÜberMichCount] = useState(0);

  const landkreise = formData.region
    ? landkreiseMap[formData.region] || []
    : [];

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f5f5f5";
    document.body.style.color = darkMode ? "#e0e0e0" : "#222";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [darkMode]);

  useEffect(() => {
    console.log("JWT token:", token);
    if (!token) return;
    axios
      .get("/api/client-profiles/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setFormData(res.data[0]);
        }
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(logo);
  }, [logo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "über_mich") setÜberMichCount(value.length);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "region" ? { landkreis: "" } : {}),
    }));
  };

  const validateFields = () => {
    const phoneRegex = /^\+?\d{6,20}$/;
    const plzRegex = /^\d{5}$/;
    const urlRegex = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;

    if (formData.contact_phone && !phoneRegex.test(formData.contact_phone))
      return "Telefonnummer ist ungültig.";

    if (formData.plz && !plzRegex.test(formData.plz))
      return "Postleitzahl muss genau 5 Ziffern enthalten.";

    if (formData.external_link && !urlRegex.test(formData.external_link))
      return "Externer Link ist ungültig.";

    if (formData.über_mich.length > 500)
      return "„Über mich“ darf maximal 500 Zeichen enthalten.";

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.get("/api/client-profiles/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.find((p: any) => p && p.id);
      const url = profile
        ? `/api/client-profiles/${profile.id}/`
        : "/api/client-profiles/";
      const method = profile ? "put" : "post";

      const sendData = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        sendData.append(key, value as string)
      );
      if (logo) sendData.append("logo", logo);

      await axios({
        method,
        url,
        data: sendData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("✔️ Profil wurde erfolgreich gespeichert.");
      setTimeout(() => setSuccess(""), 3000);
      setEditMode(false);
    } catch {
      setError("❌ Fehler beim Speichern.");
    }
  };
  const style = {
    container: {
      maxWidth: 700,
      margin: "40px auto",
      padding: 30,
      backgroundColor: darkMode ? "#1e1e1e" : "#fff",
      color: darkMode ? "#e0e0e0" : "#222",
      borderRadius: 10,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: darkMode
        ? "0 0 15px rgba(0,0,0,0.9)"
        : "0 0 10px rgba(0,0,0,0.1)",
      position: "relative" as const,
    },
    toggleModeBtn: {
      position: "absolute" as const,
      top: 15,
      right: 15,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 22,
      color: darkMode ? "#f9d71c" : "#555",
    },
    editBtn: {
      position: "absolute" as const,
      top: 15,
      left: 15,
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "8px 14px",
      borderRadius: 8,
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    field: { marginBottom: 20 },
    label: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: 10,
      borderRadius: 5,
      border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
      backgroundColor: darkMode ? "#2c2c2c" : "#fff",
      color: darkMode ? "#e0e0e0" : "#222",
      fontSize: 16,
    },
    textarea: {
      width: "100%",
      padding: 10,
      borderRadius: 5,
      border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
      backgroundColor: darkMode ? "#2c2c2c" : "#fff",
      color: darkMode ? "#e0e0e0" : "#222",
      fontSize: 16,
      minHeight: 80,
    },
    counter: {
      textAlign: "right" as const,
      fontSize: 12,
      color: "#999",
      marginTop: 4,
    },
    success: {
      backgroundColor: "#28a745",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 6,
      marginBottom: 15,
      fontWeight: 600,
    },
    error: {
      backgroundColor: "#dc3545",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 6,
      marginBottom: 15,
      fontWeight: 600,
    },
    button: {
      padding: 12,
      width: "100%",
      borderRadius: 5,
      border: "none",
      backgroundColor: "#28a745",
      color: "#fff",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
    },
    labelStatic: {
      fontSize: 13,
      fontWeight: 400,
      color: "#aaa",
      textTransform: "uppercase" as const,
      marginBottom: 4,
      letterSpacing: "0.5px",
    },
    valueStatic: {
      fontSize: 17,
      fontWeight: 500,
      color: "#f0f0f0",
      lineHeight: 1.4,
    },
    sectionStatic: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: "1px solid #333",
    },
    logoPreview: {
      maxWidth: "100%",
      maxHeight: 120,
      marginTop: 8,
      borderRadius: 6,
    },
    logoRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    removeLogoBtn: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "4px 8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
    tooltip: {
      marginLeft: 6,
      color: "#888",
      cursor: "help",
      fontSize: 14,
    },
  };

  return (
    <div style={style.container}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={style.toggleModeBtn}
        title="Dark Mode umschalten"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <h2>🔧 Kundenprofil</h2>

      {!editMode ? (
        <>
          <button onClick={() => setEditMode(true)} style={style.editBtn}>
            <FaEdit /> Bearbeiten
          </button>
          {Object.entries(formData)
            .filter(([key]) => key !== "id" && key !== "user")
            .map(([key, value]) => (
              <div style={style.sectionStatic} key={key}>
                <div style={style.labelStatic}>{key.replace(/_/g, " ")}</div>
                <div style={style.valueStatic}>
                  {value?.toString().trim() || "–"}
                </div>
              </div>
            ))}
          {logoPreview && (
            <div style={{ marginTop: 10 }}>
              <div style={style.labelStatic}>Logo:</div>
              <img
                src={logoPreview}
                alt="Logo Vorschau"
                style={style.logoPreview}
              />
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          {[
            { name: "institution_name", label: "Name der Institution" },
            { name: "contact_person", label: "Kontaktperson" },
            { name: "contact_function", label: "Funktion" },
            { name: "contact_phone", label: "Telefonnummer" },
            {
              name: "external_link",
              label: "Externer Link",
              tooltip: "z. B. Webseite oder Social Media",
            },
          ].map((field) => (
            <div style={style.field} key={field.name}>
              <label style={style.label}>
                {field.label}
                {field.tooltip && (
                  <span title={field.tooltip} style={style.tooltip}>
                    <FaInfoCircle />
                  </span>
                )}
              </label>
              <input
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                style={style.input}
              />
            </div>
          ))}

          <div style={style.field}>
            <label style={style.label}>Bundesland</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              style={style.input}
              required
            >
              <option value="">-- Bitte auswählen --</option>
              {Object.keys(landkreiseMap).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div style={style.field}>
            <label style={style.label}>Landkreis</label>
            <select
              name="landkreis"
              value={formData.landkreis}
              onChange={handleChange}
              style={style.input}
              required
              disabled={!formData.region}
            >
              <option value="">-- Bitte auswählen --</option>
              {landkreise.map((kreis) => (
                <option key={kreis} value={kreis}>
                  {kreis}
                </option>
              ))}
            </select>
          </div>

          {["stadt", "plz", "strasse_nr"].map((field) => (
            <div style={style.field} key={field}>
              <label style={style.label}>
                {field === "stadt"
                  ? "Stadt"
                  : field === "plz"
                  ? "Postleitzahl"
                  : "Straße & Nr."}
              </label>
              <input
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                style={style.input}
              />
            </div>
          ))}

          <div style={style.field}>
            <label style={style.label}>Über mich</label>
            <textarea
              name="über_mich"
              value={formData.über_mich}
              onChange={handleChange}
              maxLength={500}
              style={style.textarea}
            />
            <div style={style.counter}>{überMichCount} / 500 Zeichen</div>
          </div>

          <div style={style.field}>
            <label style={style.label}>Logo hochladen (optional)</label>
            <div style={style.logoRow}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                style={style.input}
              />
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  style={style.removeLogoBtn}
                  title="Logo entfernen"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {logoPreview && (
              <img src={logoPreview} alt="Vorschau" style={style.logoPreview} />
            )}
          </div>

          {success && <p style={style.success}>{success}</p>}
          {error && <p style={style.error}>{error}</p>}

          <button style={style.button} type="submit">
            <FaSave style={{ marginRight: 6 }} />
            Speichern
          </button>
        </form>
      )}
    </div>
  );
};

export default ClientSetupForm;
