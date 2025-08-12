// 📁 ChatBot.tsx – Kompletter Chatbot mit Icons (🗑️ ➖ ❌) und OpenRouter AI

import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTrash, FaTimes } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);          // 🔓 Sichtbarkeit des Fensters
  const [minimized, setMinimized] = useState(false); // ⬇ Minimierter Zustand
  const [messages, setMessages] = useState<string[]>([]); // 💬 Chatverlauf
  const [input, setInput] = useState('');            // ✍️ Benutzereingabe
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔃 Automatisches Scrollen zum letzten Element
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🤖 Anfrage an OpenRouter AI
  const sendToAI = async (text: string) => {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`, // ❗ Ersetze durch deinen Schlüssel
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'Du bist ein hilfreicher Assistent für die Plattform ecoMatch. Antworte in max. 3 Sätzen auf Fragen zu Registrierung, Gastmodus, Dienstleistungen und Abonnements.',
            },
            { role: 'user', content: text },
          ],
        }),
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || 'Es gab ein Problem mit der Antwort.';
    } catch (err) {
      console.error('AI Fehler:', err);
      return 'Technischer Fehler – bitte später erneut versuchen.';
    }
  };

  // 📤 Nachricht absenden
  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, `👤 ${userText}`]);
    setInput('');

    const botResponse = await sendToAI(userText);
    setMessages((prev) => [...prev, `🤖 ${botResponse}`]);
  };

  // 🗑 Verlauf löschen
  const handleReset = () => {
    setMessages([]);
  };

  // ❌ Schließen
  const handleClose = () => {
    setOpen(false);
  };

  // ➖ Minimieren
  const handleMinimize = () => {
    setMinimized(true);
  };

  return (
    <div className="chatbot-fixed-wrapper">
      {/* 🟢 Start-Button */}
      {!open && (
        <button className="chatbot-button" onClick={() => setOpen(true)}>
          <FaRobot size={24} />
        </button>
      )}

      {/* 💬 Hauptfenster */}
      {open && !minimized && (
        <div className="chatbot-window">
          {/* 🔝 Header mit Icons */}
          <div className="chatbot-header">
            <span>ecoBot 🤖</span>
            <div className="chatbot-icons">
              <FaTrash title="Verlauf löschen" className="chatbot-icon" onClick={handleReset} />
              <span title="Minimieren" className="chatbot-icon" onClick={handleMinimize}>
                &minus;
              </span>
              <FaTimes title="Schließen" className="chatbot-icon" onClick={handleClose} />
            </div>
          </div>

          {/* 📄 Nachrichtenbereich */}
          <div className="chatbot-body">
            {messages.map((msg, idx) => {
              const isBot = msg.startsWith('🤖');
              return (
                <div key={idx} className={`chatbot-message ${isBot ? 'bot' : 'user'}`}>
                  {msg}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* ✍️ Eingabebereich */}
          <div className="chatbot-input">
            <textarea
              placeholder="Stelle eine Frage..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            />
            <button onClick={handleSend}>Senden</button>
          </div>
        </div>
      )}

      {/* 🔽 Minimierter Zustand */}
      {open && minimized && (
        <button className="chatbot-minimized-button" onClick={() => setMinimized(false)}>
          💬 ecoBot öffnen
        </button>
      )}
    </div>
  );
};

export default ChatBot;
