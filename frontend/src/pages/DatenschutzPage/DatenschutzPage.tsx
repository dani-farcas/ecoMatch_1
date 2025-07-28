// 📄 src/pages/DatenschutzPage.tsx
import React from "react";
import "./DatenschutzPage.css"; // ✅ Importă stilurile externe

const DatenschutzPage: React.FC = () => {
  return (
    <div className="datenschutz-container">
      <h1>Datenschutzerklärung</h1>

      <p>
        Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG).
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist das Projektteam von ecoMatch.
        Bei Fragen zum Datenschutz erreichen Sie uns unter: <strong>datenschutz@ecomatch.online</strong>
      </p>

      <h2>2. Welche Daten wir verarbeiten</h2>
      <p>Wir verarbeiten nur die Daten, die Sie uns aktiv übermitteln:</p>
      <ul>
        <li>E-Mail-Adresse (für Registrierung und Kommunikation)</li>
        <li>IP-Adresse (zur Missbrauchsprävention bei Gastanfragen)</li>
        <li>Name, Adresse, Beschreibung bei Serviceanfragen</li>
      </ul>

      <h2>3. Zweck der Datenverarbeitung</h2>
      <p>Die Verarbeitung erfolgt zu folgenden Zwecken:</p>
      <ul>
        <li>Erstellung eines Benutzerkontos</li>
        <li>Vermittlung von passenden Dienstleistern (Matching)</li>
        <li>Bearbeitung von Serviceanfragen</li>
        <li>Versand von Bestätigungsemails</li>
      </ul>

      <h2>4. Speicherung & Sicherheit</h2>
      <p>
        Ihre Daten werden auf einem sicheren Server in Deutschland gespeichert (PostgreSQL in Docker-Umgebung). Es erfolgt keine Weitergabe an Dritte oder externe Werbepartner.
      </p>

      <h2>5. Keine Cookies / kein Tracking</h2>
      <p>
        Wir verwenden keine Cookies, keine Tracking-Tools (wie Google Analytics) und kein Profiling.
      </p>

      <h2>6. Ihre Rechte laut DSGVO</h2>
      <p>Sie haben das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten</li>
        <li>Berichtigung oder Löschung Ihrer Daten</li>
        <li>Widerruf der Einwilligung</li>
        <li>Beschwerde bei einer Aufsichtsbehörde</li>
      </ul>

      <h2>7. Kontakt</h2>
      <p>
        Für Datenschutz-Anfragen kontaktieren Sie uns bitte unter:
        <br />
        <strong>datenschutz@ecomatch.online</strong>
      </p>
    </div>
  );
};

export default DatenschutzPage;
