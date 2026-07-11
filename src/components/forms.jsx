import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import es from "../locales/home/es.json";
import en from "../locales/home/en.json";
import SuccessModal from "./successModal";

const N8N_URL = import.meta.env.VITE_FORM_WEBHOOK_PROD_URL; // Cambia según entorno (usar VITE_FORM_WEBHOOK_PROD_URL para producción)

const translationsByLang = { es, en };

const MAP_CHALLENGE_CATEGORY = {
  tiempo:                     "process_automation",
  clientes:                   "ai_chatbot",
  leads:                      "process_automation",
  empezar:                    "other",
  asistente:                  "ai_chatbot",
  herramientas_desconectadas: "system_integration",
};

const MAP_URGENCY_PRIORITY = {
  alta:  "high",
  media: "medium",
  baja:  "low",
};

const Pill = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
      selected
        ? "bg-cyan text-white border-cyan"
        : "bg-white text-gray-700 border-gray-200 hover:border-cyan"
    }`}
  >
    {label}
  </button>
);

const ProjectRequestForm = () => {
  const location = useLocation();
  const pathLang = location.pathname.split("/")[1];
  const lang = ["es", "en"].includes(pathLang) ? pathLang : "es";
  const tf = (translationsByLang[lang] || translationsByLang.es).form;

  const [currentStep, setCurrentStep] = useState(0);

  // Step 1 — contacto
  const [clientName,    setClientName]    = useState("");
  const [clientEmail,   setClientEmail]   = useState("");
  const [clientPhone,   setClientPhone]   = useState("");
  const [clientCompany, setClientCompany] = useState("");

  // Step 2 — reto
  const [selectedReto, setSelectedReto] = useState("");

  // Step 3 — contexto
  const [selectedVolumenClientes, setSelectedVolumenClientes] = useState("");
  const [selectedHerramientas,    setSelectedHerramientas]    = useState([]);
  const [selectedUrgencia,        setSelectedUrgencia]        = useState("");

  const [errors,           setErrors]           = useState({});
  const [submitting,       setSubmitting]        = useState(false);
  const [showSuccessModal, setShowSuccessModal]  = useState(false);

  // ── Validaciones ────────────────────────────────────────────
  const validateStep0 = () => {
    const e = {};
    const s1e = tf.step1.errors;
    if (!clientName.trim())    e.clientName    = s1e.name_required;
    if (!clientEmail.trim())   e.clientEmail   = s1e.email_required;
    if (!clientCompany.trim()) e.clientCompany = s1e.company_required;
    if (!clientPhone.trim())   e.clientPhone   = s1e.phone_required;
    if (clientEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail))
      e.clientEmail = s1e.email_invalid;
    if (clientPhone && !/^[0-9]{7,15}$/.test(clientPhone))
      e.clientPhone = s1e.phone_invalid;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e = {};
    if (!selectedReto) e.reto = tf.step2.errors.reto_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    const s3e = tf.step3.errors;
    if (!selectedVolumenClientes) e.volumenClientes = s3e.volumen_clientes_required;
    if (!selectedUrgencia)        e.urgencia        = s3e.urgencia_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navegación ──────────────────────────────────────────────
  const nextStep = () => {
    if (currentStep === 0 && !validateStep0()) return;
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < tf.steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const toggleHerramienta = (h) => {
    setSelectedHerramientas((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const challengeLabel = tf.step2.retos.find((r) => r.id === selectedReto)?.title || selectedReto;
    const urgencyLabel   = tf.step3.urgencia.options.find((u) => u.id === selectedUrgencia)?.label || selectedUrgencia;

    const payload = {
      // Contact data
      name:    clientName,
      company: clientCompany,
      email:   clientEmail,
      phone:   clientPhone,

      // Lead context
      challenge:    selectedReto,
      client_volume: selectedVolumenClientes,
      tools:         selectedHerramientas.join(", "),
      urgency:       selectedUrgencia,
      channel:       "form",
      language:      lang,

      // For n8n / AI processing
      category: MAP_CHALLENGE_CATEGORY[selectedReto] || "other",
      priority: MAP_URGENCY_PRIORITY[selectedUrgencia] || "medium",

      // Summary for the AI Agent
      summary: `Challenge: ${challengeLabel}. Client volume: ${selectedVolumenClientes}. Tools: ${selectedHerramientas.join(", ") || "none indicated"}. Urgency: ${urgencyLabel}. Company: ${clientCompany || "Not provided"}.`,
    };

    try {
      setSubmitting(true);
      await axios.post(N8N_URL, payload);

      // Reset
      setCurrentStep(0);
      setClientName("");   setClientEmail("");
      setClientPhone("");  setClientCompany("");
      setSelectedReto(""); setSelectedVolumenClientes("");
      setSelectedHerramientas([]); setSelectedUrgencia("");
      setErrors({});
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Error al enviar solicitud:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-navy mb-2">{tf.title}</h2>
      <p className="text-gray-500 text-sm mb-6">{tf.subtitle}</p>

      {/* Progressbar */}
      <div className="flex items-center gap-4 mb-8">
        {tf.steps.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                idx < currentStep   ? "bg-cyan text-white" :
                idx === currentStep ? "bg-cyan text-white ring-4 ring-cyan/20" :
                                      "bg-gray-200 text-gray-500"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${idx <= currentStep ? "text-cyan" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {idx < tf.steps.length - 1 && (
              <div className={`w-8 h-0.5 ${idx < currentStep ? "bg-cyan" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── STEP 1: Datos de contacto ── */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tf.step1.fields.name.label} <span className="text-cyan">*</span>
                </label>
                <input type="text" placeholder={tf.step1.fields.name.placeholder} value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tf.step1.fields.company.label} <span className="text-cyan">*</span>
                </label>
                <input type="text" placeholder={tf.step1.fields.company.placeholder} value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientCompany && <p className="text-red-500 text-sm mt-1">{errors.clientCompany}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tf.step1.fields.email.label} <span className="text-cyan">*</span>
                </label>
                <input type="email" placeholder={tf.step1.fields.email.placeholder} value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tf.step1.fields.phone.label} <span className="text-cyan">*</span>
                </label>
                <input type="text" placeholder={tf.step1.fields.phone.placeholder} value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientPhone && <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>}
              </div>
            </div>

            <button type="button" onClick={nextStep}
              className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-3 rounded-lg transition-all w-full sm:w-auto"
            >
              {tf.step1.next_button}
            </button>
          </div>
        )}

        {/* ── STEP 2: Tu reto ── */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">
                {tf.step2.question} <span className="text-cyan">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tf.step2.retos.map(({ id, emoji, title, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedReto(id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedReto === id
                        ? "border-cyan bg-cyan-pale"
                        : "border-gray-200 bg-white hover:border-cyan/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{emoji}</div>
                    <p className="font-semibold text-navy text-sm mb-1">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </button>
                ))}
              </div>
              {errors.reto && <p className="text-red-500 text-sm mt-2">{errors.reto}</p>}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={prevStep}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {tf.step2.prev_button}
              </button>
              <button type="button" onClick={nextStep}
                disabled={!selectedReto}
                className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {tf.step2.next_button}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Contexto ── */}
        {currentStep === 2 && (
          <div className="space-y-8">

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {tf.step3.volumen_clientes.question} <span className="text-cyan">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {tf.step3.volumen_clientes.options.map((opt) => (
                  <Pill key={opt} label={opt}
                    selected={selectedVolumenClientes === opt}
                    onClick={() => setSelectedVolumenClientes(opt)}
                  />
                ))}
              </div>
              {errors.volumenClientes && <p className="text-red-500 text-sm mt-2">{errors.volumenClientes}</p>}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {tf.step3.herramientas.question}{" "}
                <span className="text-gray-400 font-normal">({tf.step3.herramientas.hint})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {tf.step3.herramientas.options.map((opt) => (
                  <Pill key={opt} label={opt}
                    selected={selectedHerramientas.includes(opt)}
                    onClick={() => toggleHerramienta(opt)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {tf.step3.urgencia.question} <span className="text-cyan">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {tf.step3.urgencia.options.map(({ id, label }) => (
                  <Pill key={id} label={label}
                    selected={selectedUrgencia === id}
                    onClick={() => setSelectedUrgencia(id)}
                  />
                ))}
              </div>
              {errors.urgencia && <p className="text-red-500 text-sm mt-2">{errors.urgencia}</p>}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={prevStep}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {tf.step3.prev_button}
              </button>
              <button type="submit" disabled={submitting}
                className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {submitting ? tf.step3.submitting : tf.step3.submit_button}
              </button>
            </div>
          </div>
        )}
      </form>

      <p className="text-center text-gray-400 text-xs mt-8">{tf.footer_text}</p>

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={tf.success_message}
        />
      )}
    </div>
  );
};

export default ProjectRequestForm;