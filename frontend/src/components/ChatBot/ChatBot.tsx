import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaTrash } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🧠 Anfrage an OpenRouter AI
  const sendToAI = async (text: string) => {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
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

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, `👤 ${userText}`]);
    setInput('');

    const botResponse = await sendToAI(userText);
    setMessages((prev) => [...prev, `🤖 ${botResponse}`]);
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot-fixed-wrapper">
      {!open && (
        <button className="chatbot-button" onClick={() => setOpen(true)}>
          <FaRobot size={24} />
        </button>
      )}

      {open && !minimized && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>ecoBot 🤖</span>
            <div>
              <FaTrash onClick={handleReset} title="Verlauf löschen" style={{ cursor: 'pointer', marginRight: '10px' }} />
              <FaTimes onClick={() => setOpen(false)} title="Schließen" style={{ cursor: 'pointer', marginRight: '10px' }} />
              <button onClick={() => setMinimized(true)} title="Minimieren" style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
              }}>
                ⬇
              </button>
            </div>
          </div>
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
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Stelle eine Frage..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Senden</button>
          </div>
        </div>
      )}

      {open && minimized && (
        <button className="chatbot-minimized-button" onClick={() => setMinimized(false)}>
          ecoBot öffnen ↑
        </button>
      )}
    </div>
  );
};

export default ChatBot;
