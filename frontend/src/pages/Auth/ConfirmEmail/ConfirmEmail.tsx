import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import BackgroundWrapper from "@/components/BackgroundWrapper/BackgroundWrapper";
import "./ConfirmEmail.css";

const ConfirmEmail: React.FC = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  // ✅ State für Erfolg und Nachricht
  const [erfolg, setErfolg] = useState(false);
  const [nachricht, setNachricht] = useState(
    "⏳ Bitte warte, deine E-Mail wird bestätigt..."
  );

  // 📌 Anfrage an das Backend, um die E-Mail zu bestätigen
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(`confirm-email/${uid}/${token}/`);
        setNachricht(response.data.message);
        setErfolg(true);
      } catch {
        setNachricht(
          "❌ Die Bestätigung ist fehlgeschlagen oder der Link ist ungültig/abgelaufen."
        );
        setErfolg(false);
      }
    };

    if (uid && token) {
      confirmEmail();
    } else {
      setNachricht("❌ Ungültiger Bestätigungslink – fehlende Parameter.");
      setErfolg(false);
    }
  }, [uid, token]);

  // 🔄 Navigation nach Login
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <BackgroundWrapper>
      <div className="confirm-container">
        {erfolg ? (
          <>
            <h2 className="confirm-success">🎉 Willkommen bei ecoMatch!</h2>
            <p className="confirm-message">{nachricht}</p>
            <button onClick={handleLoginRedirect} className="confirm-button">
              Jetzt einloggen
            </button>
          </>
        ) : (
          <p className="confirm-error">{nachricht}</p>
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default ConfirmEmail;
