// 📁 src/pages/User/RequestsSection/RequestDetail.tsx
// 🇩🇪 Detail-Ansicht einer Anfrage mit PDF-Export

import React from "react";
import jsPDF from "jspdf";
import "./RequestDetail.css";

interface Props {
  request: {
    id: number;
    title: string;
    beschreibung: string;
    status: string;
    created_at: string;
    services: { id: number; name: string }[];
  };
  onClose: () => void;
}

const RequestDetail: React.FC<Props> = ({ request, onClose }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Anfrage-Details", 20, 20);
    doc.text(`Titel: ${request.title}`, 20, 40);
    doc.text(`Status: ${request.status}`, 20, 50);
    doc.text(
      `Datum: ${new Date(request.created_at).toLocaleDateString("de-DE")}`,
      20,
      60
    );
    doc.text(`Beschreibung: ${request.beschreibung || "-"}`, 20, 80);
    doc.text(
      `Leistungen: ${request.services.map((s) => s.name).join(", ") || "-"}`,
      20,
      100
    );
    doc.save(`${request.title}.pdf`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{request.title}</h3>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Status:</strong> {request.status}
          </p>
          <p>
            <strong>Datum:</strong>{" "}
            {new Date(request.created_at).toLocaleDateString("de-DE")}
          </p>
          <p>
            <strong>Beschreibung:</strong> {request.beschreibung || "–"}
          </p>
          <p>
            <strong>Leistungen:</strong>{" "}
            {request.services.map((s) => s.name).join(", ") || "–"}
          </p>
        </div>

        {/* 📄 PDF-Button unten zentriert */}
        <div className="modal-footer">
          <button className="btn-pdf" onClick={exportPDF}>
            📄 Als PDF speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
