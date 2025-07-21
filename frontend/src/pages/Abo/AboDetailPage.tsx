import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const abonnements = [
  {
    id: 'basis',
    name: 'Basis',
    beschreibung: 'Ideal für Einsteiger – kostenlos starten mit reduziertem Funktionsumfang.',
    features: {
      zugang: true,
      vermittlung: false,
      statistik: false,
      support: false,
      topPlatzierung: false,
    },
  },
  {
    id: 'profi',
    name: 'Profi',
    beschreibung: 'Bevorzugte Vermittlung und besser sichtbares Profil.',
    features: {
      zugang: true,
      vermittlung: true,
      statistik: false,
      support: true,
      topPlatzierung: false,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    beschreibung: 'Alle Funktionen freigeschaltet, inklusive Statistik und Support.',
    features: {
      zugang: true,
      vermittlung: true,
      statistik: true,
      support: true,
      topPlatzierung: true,
    },
  },
];

const featureLabels: { [key: string]: string } = {
  zugang: 'Eingeschränkter Zugang',
  vermittlung: 'Bevorzugte Vermittlung',
  statistik: 'Statistik & Analysen',
  support: 'Persönlicher Support',
  topPlatzierung: 'Top-Platzierung im Verzeichnis',
};

const AboDetailPage: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      alert(`Du hast das ${selected}-Abo ausgewählt.`);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ecfdf5',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '3rem 2rem',
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '3rem',
        fontSize: '2.4rem',
        lineHeight: '1.6',
      }}>
        Wähle dein Abonnement
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2.5rem',
        }}>
          {abonnements.map((abo) => (
            <label key={abo.id} htmlFor={abo.id} style={{
              backgroundColor: 'white',
              padding: '2.5rem',
              borderRadius: '6px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              width: '320px',
              border: selected === abo.id ? '2px solid #15803d' : '1px solid #ddd',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              lineHeight: '1.8',
            }}>
              <input
                type="radio"
                name="abo"
                id={abo.id}
                value={abo.id}
                checked={selected === abo.id}
                onChange={() => setSelected(abo.id)}
                style={{ display: 'none' }}
              />
              <div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>{abo.name}</h2>
                <p style={{
                  marginBottom: '2rem',
                  fontSize: '1rem',
                  color: '#333',
                  lineHeight: '1.9',
                }}>
                  {abo.beschreibung}
                </p>

                <ul style={{
                  paddingLeft: '1rem',
                  listStyle: 'none',
                  marginBottom: '2rem',
                }}>
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <li key={key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1.1rem',
                      lineHeight: '1.9',
                    }}>
                      {abo.features[key as keyof typeof abo.features] ? (
                        <FaCheck style={{ color: '#15803d', marginRight: '0.6rem' }} />
                      ) : (
                        <span style={{ width: '1.25rem', display: 'inline-block', marginRight: '0.6rem' }} />
                      )}
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                marginTop: 'auto',
                backgroundColor: '#15803d',
                color: 'white',
                textAlign: 'center',
                padding: '0.7rem',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}>
                Jetzt auswählen
              </div>
            </label>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button
            type="submit"
            disabled={!selected}
            style={{
              backgroundColor: '#15803d',
              color: 'white',
              padding: '0.9rem 2.5rem',
              fontSize: '1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
              opacity: selected ? 1 : 0.5,
              fontWeight: 'bold',
            }}
          >
            Absenden
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboDetailPage;
