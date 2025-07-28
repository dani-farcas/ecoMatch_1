// 📁 frontend/src/pages/GastConfirmieren.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GastConfirmieren: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`http://localhost:8000/api/gast/confirm/?token=${token}`)
      .then((res) => {
        if (res.ok) {
          setStatus("success");
          setTimeout(() => navigate("/gast-anfrage"), 3000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [navigate]);

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      {status === "loading" && <p>⏳ Bestätigung wird verarbeitet...</p>}
      {status === "success" && <p>✅ E-Mail erfolgreich bestätigt. Weiterleitung...</p>}
      {status === "error" && <p>❌ Ungültiger oder abgelaufener Link.</p>}
    </div>
  );
};

export default GastConfirmieren;
