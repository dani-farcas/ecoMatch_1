// 📁 src/pages/User/ProfileSection/ProfileView.tsx
import React from "react";
import jsPDF from "jspdf";
import "./ProfileView.css";

interface Props {
  user: any;
  onEdit: () => void;
}

const ProfileView: React.FC<Props> = ({ user, onEdit }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Benutzerprofil", 20, 20);
    doc.text(`Name: ${user.first_name} ${user.last_name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);
    doc.text(`Telefon: ${user.telefon || "-"}`, 20, 60);
    doc.text(`Firma: ${user.firma || "-"}`, 20, 70);
    doc.text(
      `Adresse: ${user.strasse || ""} ${user.hausnummer || ""}, ${user.plz || ""} ${user.stadt || ""}`,
      20,
      80
    );
    doc.text(`Über mich: ${user.ueber_mich || "-"}`, 20, 100);
    doc.save("Profil.pdf");
  };

  // Hilfsfunktion für Initialen
  const getInitialen = () => {
    const v = user.first_name ? user.first_name.charAt(0).toUpperCase() : "";
    const n = user.last_name ? user.last_name.charAt(0).toUpperCase() : "";
    return v + n || "?";
  };

  return (
    <div className="profile-view">
      {/* Header mit Avatar */}
      <div className="profile-header">
        {user.profile_image ? (
          <img
            src={user.profile_image}
            alt="Profilbild"
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar placeholder">{getInitialen()}</div>
        )}
        <h2>Mein Profil</h2>
      </div>

      {/* Datenkarte */}
      <div className="profile-card">
        <p>
          <b>Name:</b> {user.first_name} {user.last_name}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Telefon:</b> {user.telefon || "-"}
        </p>
        <p>
          <b>Firma:</b> {user.firma || "-"}
        </p>
        <p>
          <b>Adresse:</b> {user.strasse} {user.hausnummer}, {user.plz}{" "}
          {user.stadt}
        </p>
        <p>
          <b>Über mich:</b> {user.ueber_mich || "-"}
        </p>
      </div>

      {/* Aktionen */}
      <div className="profile-actions">
        <button className="edit-btn" onClick={onEdit}>
          Profil ändern
        </button>
        <button className="pdf-btn" onClick={downloadPDF}>
          Als PDF herunterladen
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
