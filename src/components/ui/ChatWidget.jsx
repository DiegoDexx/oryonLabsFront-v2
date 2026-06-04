import { useState } from 'react';
import { FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa';

const quickQuestions = [
  '¿Qué servicios ofrecéis?',
  'Ver planes y precios',
  'Solicitar consulta gratuita',
  '¿Cómo funciona la IA?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '¡Hola! Soy el asistente virtual de Oryon Labs. ¿En qué puedo ayudarte hoy?',
      time: '12:29',
    },
  ]);

  // FASE 2 — conectar con webhook n8n
  // const WEBHOOK_URL = import.meta.env.VITE_CHAT_WEBHOOK_URL

  const handleSend = () => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: message,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // FASE 2: Aquí se conectará con n8n
    // Por ahora solo simulamos respuesta
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Gracias por tu mensaje. Un experto te contactará pronto.',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);

    setMessage('');
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-cyan hover:bg-cyan-medium text-white rounded-full shadow-2xl flex items-center justify-center transition-all z-50 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan to-cyan-medium px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Asistente Oryon</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/80 text-xs">En línea</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-cyan text-white'
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${msg.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 text-center">Preguntas rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3 py-1.5 bg-white border border-cyan text-cyan text-xs rounded-full hover:bg-cyan hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-cyan hover:bg-cyan-medium text-white rounded-full flex items-center justify-center transition-all"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Powered by Oryon Labs AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
