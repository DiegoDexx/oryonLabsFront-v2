import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaTimes, FaRedo } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { buildSystemPrompt } from '../../config/chatPrompt';
import ridleyImg from '../../assets/img/ridley.png';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const WEBHOOK_URL        = import.meta.env.VITE_CHAT_WEBHOOK_PROD_URL;
const RATE_LIMIT         = 10;
const RATE_WINDOW        = 60 * 60 * 1000;
const TIMEOUT_MS         = 30000;
const STORAGE_KEY        = 'oryon_chat_limit';
const SESSION_KEY        = 'oryon_session_id';
const translationsByLang = { es, en };

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'oryon_' + crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getMessageCount() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const now  = Date.now();
  if (!data.timestamp || now - data.timestamp > RATE_WINDOW) return 0;
  return data.count || 0;
}

function incrementMessageCount() {
  const data  = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const now   = Date.now();
  const reset = !data.timestamp || now - data.timestamp > RATE_WINDOW;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    count:     reset ? 1 : (data.count || 0) + 1,
    timestamp: reset ? now : data.timestamp,
  }));
}

export default function ChatWidget({ autoOpen = false }) {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang     = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t        = (translationsByLang[lang] || translationsByLang.es).chatbot;

  const [isOpen,    setIsOpen]    = useState(autoOpen);
  const [message,   setMessage]   = useState('');
  const [messages,  setMessages]  = useState([
    {
      type: 'bot',
      text: t.initial_message,
      time: new Date().toLocaleTimeString(
        lang === 'en' ? 'en-US' : 'es-ES',
        { hour: '2-digit', minute: '2-digit' }
      ),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [hasError,  setHasError]  = useState(false);
  const [leadDone,  setLeadDone]  = useState(false);
  const [msgCount,  setMsgCount]  = useState(getMessageCount);

  const messagesEndRef = useRef(null);
  const sessionId      = getSessionId();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  useEffect(() => {
    setIsLimited(getMessageCount() >= RATE_LIMIT);
  }, []);

  const remaining = Math.max(0, RATE_LIMIT - msgCount);

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, {
      type,
      text,
      time: new Date().toLocaleTimeString(
        lang === 'en' ? 'en-US' : 'es-ES',
        { hour: '2-digit', minute: '2-digit' }
      ),
    }]);
  };

  const handleSend = async (text) => {
    const input = (text || message).trim();
    if (!input || isLoading || isLimited || leadDone) return;

    if (getMessageCount() >= RATE_LIMIT) {
      setIsLimited(true);
      addMessage('bot', t.rate_limit_msg);
      return;
    }

    setMessage('');
    setHasError(false);
    addMessage('user', input);
    incrementMessageCount();
    const newCount = getMessageCount();
    setMsgCount(newCount);
    if (newCount >= RATE_LIMIT) setIsLimited(true);
    setIsLoading(true);

    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal:  controller.signal,
        body: JSON.stringify({
          chatInput:    input,
          sessionId,
          language:     lang,
          systemPrompt: buildSystemPrompt(lang),
          model:        'anthropic/claude-3-5-haiku',
          max_tokens:   400,
          temperature:  0.3,
          metadata: {
            pageUrl:   window.location.href,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const respuesta = data.respuesta_prompt || data.respuesta || data.response || '';

      if (data.create_lead === true || data.datos_suficientes_para_crm === true) {
        addMessage('bot', respuesta || t.lead_confirmed_msg);
        setLeadDone(true);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        addMessage('bot', respuesta || t.error_msg);
      }

    } catch (err) {
      clearTimeout(timeout);
      setHasError(true);
      addMessage('bot', err.name === 'AbortError' ? t.timeout_msg : t.error_msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    const last = messages.filter(m => m.type === 'user').at(-1);
    if (last) handleSend(last.text);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat con Ridley"
          className="fixed bottom-6 right-6 w-14 h-14 bg-cyan hover:bg-cyan-medium rounded-full shadow-2xl flex items-center justify-center transition-all z-50 hover:scale-110"
        >
          <img
            src={ridleyImg}
            alt="Ridley chatbot"
            className="w-10 h-10 object-contain"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >

          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #060F27 0%, #0090C9 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{t.header_title}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs">{t.online_status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset — solo en DEV */}
              {import.meta.env.DEV && (
                <button
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem(SESSION_KEY);
                    sessionStorage.removeItem(SESSION_KEY);
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className="text-[10px] text-white/50 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Rate bar */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 border-b border-gray-100">
            <div className="flex gap-[3px]">
              {Array.from({ length: RATE_LIMIT }, (_, i) => (
                <div
                  key={i}
                  className="w-[7px] h-[7px] rounded-full transition-colors duration-300"
                  style={{ background: i < msgCount ? '#e0e0e0' : '#0090C9' }}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 ml-auto whitespace-nowrap">
              {leadDone
                ? (lang === 'en' ? 'Request registered ✅' : 'Solicitud registrada ✅')
                : isLimited
                  ? (lang === 'en' ? 'Limit reached' : 'Límite alcanzado')
                  : `~${remaining} ${lang === 'en' ? 'messages left' : 'mensajes disponibles'}`}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-[8rem] overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-cyan text-white'
                    : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.type === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Retry */}
            {hasError && !isLoading && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 text-xs text-cyan border border-cyan px-3 py-2 rounded-full hover:bg-cyan hover:text-white transition-all"
                >
                  <FaRedo className="w-3 h-3" />
                  {t.retry}
                </button>
              </div>
            )}

            {/* Lead confirmed */}
            {leadDone && (
              <div className="flex justify-center mb-4">
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2 rounded-full">
                  {t.lead_done_badge}
                </div>
              </div>
            )}

            {/* Limit reached */}
            {(isLimited || leadDone) && (
              <div className="text-center text-xs text-gray-500 px-3 py-2 bg-gray-100 rounded-lg mx-2">
                {leadDone ? (
                  lang === 'en'
                    ? <>Need more help? Use our <a href="/en/contact" className="text-cyan underline">contact form</a>.</>
                    : <>¿Necesitas más ayuda? Usa nuestro <a href="/es/contacto" className="text-cyan underline">formulario de contacto</a>.</>
                ) : (
                  lang === 'en'
                    ? <>Limit reached. Try again in 1 hour or use our <a href="/en/contact" className="text-cyan underline">contact form</a>.</>
                    : <>Límite alcanzado. Inténtalo en 1 hora o usa nuestro <a href="/es/contacto" className="text-cyan underline">formulario de contacto</a>.</>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {!leadDone && !isLimited && (
            <div className="px-4 py-3 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 text-center">
                {t.quick_questions_label}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.quick_questions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isLoading || isLimited}
                    className="px-3 py-1.5 bg-white border border-cyan text-cyan text-xs rounded-full hover:bg-cyan hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rate limit banner */}
          {isLimited && !leadDone && (
            <div className="px-4 py-3 bg-orange-50 border-t border-orange-200">
              <p className="text-xs text-orange-600 text-center">
                {t.rate_limit_banner}
              </p>
            </div>
          )}

          {/* Input */}
          {!leadDone && !isLimited && (
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !message.trim()}
                  className="w-10 h-10 bg-cyan hover:bg-cyan-medium text-white rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                Powered by Oryon Labs AI
              </p>
            </div>
          )}

        </div>
      )}
    </>
  );
}