import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import es from "../locales/home/es.json";
import en from "../locales/home/en.json";
import SuccessModal from "./successModal";
import { captureUtmParams, getTrackingPayload } from "../utils/tracking";
import useContactPhone from "../hooks/useContactPhone";

const N8N_URL = import.meta.env.VITE_FORM_WEBHOOK_PROD_URL; // Cambia según entorno (usar VITE_FORM_WEBHOOK_PROD_URL para producción)

const translationsByLang = { es, en };

// Valores que n8n reconoce para `category`
const MAP_CHALLENGE_CATEGORY = {
  tiempo:                     "automation_processes",
  clientes:                   "chatbot_ia",
  leads:                      "automation_processes",
  empezar:                    "other",
  asistente:                  "chatbot_ia",
  herramientas_desconectadas: "system_integration",
};

const MAP_URGENCY_PRIORITY = {
  alta:  "high",
  media: "medium",
  baja:  "low",
};

const SECTOR_IDS = ["reformas_oficios", "clinica_salud", "despacho_legal", "otro"];

const Pill = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
      selected
        ? "bg-cyan text-white border-cyan"
        : "bg-white text-gray-700 border-gray-200 hover:border-cyan"
    }`}
  >
    {label}
  </button>
);

/**
 * Formulario unificado de captación.
 *
 * Props:
 * - `variant`: "full" (3 pasos: datos → reto → contexto) | "short" (un paso
 *   mínimo que envía ya el lead + paso opcional de ampliación con `is_update`).
 * - `channel`: fuerza el valor de `channel` (p.ej. "instagram_ads"); por
 *   defecto "form".
 */
const ProjectRequestForm = ({ variant = "full", channel = "form" }) => {
  const location = useLocation();
  const pathLang = location.pathname.split("/")[1];
  const lang = ["es", "en"].includes(pathLang) ? pathLang : "es";
  const t = translationsByLang[lang] || translationsByLang.es;
  const tf = t.form;

  const isShort = variant === "short";

  // Captura UTM de la URL una vez por sesión (sobrevive a la navegación interna)
  useEffect(() => {
    captureUtmParams();
  }, []);

  // Plan preseleccionado vía ?plan=<nombre> (desde las tarjetas de pricing)
  const planParam = new URLSearchParams(location.search).get("plan");
  const planNames = (t.pricing?.plans || []).map((p) => p.name);
  const initialPlan = planParam && planNames.includes(planParam) ? planParam : "";

  const [currentStep, setCurrentStep] = useState(0);

  // Paso 1 — contacto
  const [clientName,    setClientName]    = useState("");
  const [clientEmail,   setClientEmail]   = useState("");
  const [clientPhone,   setClientPhone]   = useState("");
  const [clientCompany, setClientCompany] = useState("");

  // Paso 2 — reto
  const [selectedReto, setSelectedReto] = useState("");

  // Paso 3 — contexto
  const [selectedVolumenClientes, setSelectedVolumenClientes] = useState("");
  const [selectedHerramientas,    setSelectedHerramientas]    = useState([]);
  const [selectedUrgencia,        setSelectedUrgencia]        = useState("");

  // Campos nuevos
  const [selectedPlan,       setSelectedPlan]       = useState(initialPlan);
  const [selectedSector,     setSelectedSector]     = useState("");
  const [sectorOther,        setSectorOther]        = useState("");
  const [freeMessage,        setFreeMessage]        = useState("");
  const [privacyAccepted,    setPrivacyAccepted]    = useState(false);
  const [privacyAcceptedAt,  setPrivacyAcceptedAt]  = useState("");
  const [honeypot,           setHoneypot]           = useState("");

  const [errors,           setErrors]           = useState({});
  const [submitting,       setSubmitting]       = useState(false);
  const [submitError,      setSubmitError]      = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Modo corto: tras el primer envío, ofrece ampliar datos (is_update)
  const [leadSent, setLeadSent] = useState(false);

  const { phone: contactPhone } = useContactPhone();
  const waNumber = contactPhone.replace(/[^\d]/g, "");

  const privacyLink = `/${lang}/privacy`;

  const handlePrivacyChange = (checked) => {
    setPrivacyAccepted(checked);
    setPrivacyAcceptedAt(checked ? new Date().toISOString() : "");
  };

  // ── Validaciones ────────────────────────────────────────────
  const validateContact = () => {
    const e = {};
    const s1e = tf.step1.errors;
    if (!clientName.trim())    e.clientName    = s1e.name_required;
    if (!clientCompany.trim()) e.clientCompany = s1e.company_required;
    if (!clientPhone.trim())   e.clientPhone   = s1e.phone_required;
    // En modo corto el email es opcional
    if (!isShort && !clientEmail.trim()) e.clientEmail = s1e.email_required;
    if (clientEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail))
      e.clientEmail = s1e.email_invalid;
    if (clientPhone && !/^[0-9+\s]{7,16}$/.test(clientPhone))
      e.clientPhone = s1e.phone_invalid;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateReto = () => {
    const e = {};
    if (!selectedReto) e.reto = tf.step2.errors.reto_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateContext = () => {
    const e = {};
    const s3e = tf.step3.errors;
    if (!selectedVolumenClientes) e.volumenClientes = s3e.volumen_clientes_required;
    if (!selectedUrgencia)        e.urgencia        = s3e.urgencia_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSectorPrivacy = () => {
    const e = {};
    if (!selectedSector)  e.sector  = tf.sector.error_required;
    if (!privacyAccepted) e.privacy = tf.privacy.error_required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navegación ──────────────────────────────────────────────
  const nextStep = () => {
    if (isShort) {
      if (currentStep === 0 && !validateContact()) return;
      if (currentStep === 1 && !validateReto()) return;
      if (currentStep < 2) setCurrentStep((s) => s + 1);
      return;
    }
    if (currentStep === 0 && !validateContact()) return;
    if (currentStep === 1 && !validateReto()) return;
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

  // ── Payload ──────────────────────────────────────────────────
  const buildPayload = ({ isUpdate = false } = {}) => {
    const challengeLabel = tf.step2.retos.find((r) => r.id === selectedReto)?.title || selectedReto;
    const urgencyLabel   = tf.step3.urgencia.options.find((u) => u.id === selectedUrgencia)?.label || selectedUrgencia;

    const resumen = `Challenge: ${challengeLabel}. Client volume: ${selectedVolumenClientes}. Tools: ${selectedHerramientas.join(", ") || "none indicated"}. Urgency: ${urgencyLabel}. Company: ${clientCompany || "Not provided"}. Sector: ${selectedSector}${selectedSector === "otro" && sectorOther ? ` (${sectorOther})` : ""}.${freeMessage ? ` Message: ${freeMessage}` : ""}`;

    const payload = {
      // Contact data
      name:    clientName,
      company: clientCompany,
      email:   clientEmail,
      phone:   clientPhone,

      // Lead context
      challenge:    challengeLabel,       // n8n espera el título legible
      challenge_id: selectedReto,         // identificador interno conservado
      client_volume: selectedVolumenClientes,
      tools:         selectedHerramientas.join(", "),
      urgency:       urgencyLabel,        // n8n espera el texto de la opción
      channel,
      language:      lang,

      // Campos nuevos
      plan:                selectedPlan,
      sector:              selectedSector,
      sector_other:        selectedSector === "otro" ? sectorOther : "",
      message:             freeMessage,
      privacy_accepted:    privacyAccepted,
      privacy_accepted_at: privacyAcceptedAt,

      // For n8n / AI processing
      category: MAP_CHALLENGE_CATEGORY[selectedReto] || "other",
      priority: MAP_URGENCY_PRIORITY[selectedUrgencia] || "medium",

      // Summary for the AI Agent (ambas claves: n8n lo busca como resumen_raw)
      summary:     resumen,
      resumen_raw: resumen,

      // Tracking (sessionStorage, capturado al entrar al sitio)
      ...getTrackingPayload(location.pathname),
    };

    if (isUpdate) payload.is_update = true;
    return payload;
  };

  // ── Envío ────────────────────────────────────────────────────
  const sendPayload = async (payload) => {
    // Honeypot: si el campo trampa llega relleno, se descarta en silencio
    if (honeypot) return;
    await axios.post(N8N_URL, payload);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setClientName("");   setClientEmail("");
    setClientPhone("");  setClientCompany("");
    setSelectedReto(""); setSelectedVolumenClientes("");
    setSelectedHerramientas([]); setSelectedUrgencia("");
    setSelectedPlan(""); setSelectedSector("");
    setSectorOther("");  setFreeMessage("");
    setPrivacyAccepted(false); setPrivacyAcceptedAt("");
    setHoneypot("");
    setErrors({});
    setLeadSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(false);

    if (isShort) {
      // Modo corto: sector + privacidad viven en el último paso junto al reto/contexto corto
      if (!leadSent) {
        if (!validateContact() || !validateReto() || !validateSectorPrivacy()) return;
        try {
          setSubmitting(true);
          await sendPayload(buildPayload());
          setLeadSent(true);
          setShowSuccessModal(true);
        } catch (err) {
          console.error("Error al enviar solicitud:", err);
          setSubmitError(true); // No borramos lo que el usuario escribió
        } finally {
          setSubmitting(false);
        }
        return;
      }
      // Segundo envío opcional con los datos ampliados
      try {
        setSubmitting(true);
        await sendPayload(buildPayload({ isUpdate: true }));
        resetForm();
      } catch (err) {
        console.error("Error al enviar ampliación:", err);
        setSubmitError(true);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Modo completo (3 pasos): valida contexto + sector + privacidad
    if (!validateContext() || !validateSectorPrivacy()) return;

    try {
      setSubmitting(true);
      await sendPayload(buildPayload());
      resetForm();
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setSubmitError(true); // No borramos lo que el usuario escribió
    } finally {
      setSubmitting(false);
    }
  };

  // ── Bloques compartidos ──────────────────────────────────────
  const honeypotField = (
    <input
      type="text"
      name="company_website"
      value={honeypot}
      onChange={(e) => setHoneypot(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute opacity-0 h-0 w-0 pointer-events-none"
      style={{ position: "absolute", left: "-9999px" }}
    />
  );

  const planSelector = (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">
        {tf.plan.question}{" "}
        <span className="text-gray-400 font-normal">({tf.optional_hint})</span>
      </p>
      {initialPlan && selectedPlan === initialPlan && (
        <p className="text-xs text-cyan font-medium mb-2">
          {tf.plan.selected_label}: <strong>{initialPlan}</strong>
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {[...planNames, tf.plan.unknown].map((opt) => (
          <Pill key={opt} label={opt}
            selected={selectedPlan === opt}
            onClick={() => setSelectedPlan(opt)}
          />
        ))}
      </div>
    </div>
  );

  const sectorSelector = (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">
        {tf.sector.question} <span className="text-cyan">*</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {SECTOR_IDS.map((id) => (
          <Pill key={id} label={tf.sector.options[id]}
            selected={selectedSector === id}
            onClick={() => setSelectedSector(id)}
          />
        ))}
      </div>
      {selectedSector === "otro" && (
        <input
          type="text"
          value={sectorOther}
          onChange={(e) => setSectorOther(e.target.value)}
          placeholder={tf.sector.other_placeholder}
          maxLength={100}
          className="mt-3 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
        />
      )}
      {errors.sector && <p className="text-red-500 text-sm mt-2">{errors.sector}</p>}
    </div>
  );

  const messageField = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {tf.message.label}{" "}
        <span className="text-gray-400 font-normal">({tf.optional_hint})</span>
      </label>
      <textarea
        rows={4}
        maxLength={1000}
        value={freeMessage}
        onChange={(e) => setFreeMessage(e.target.value)}
        placeholder={tf.message.placeholder}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700 resize-none"
      />
      <p className="text-xs text-gray-400 mt-1 text-right">{freeMessage.length}/1000</p>
    </div>
  );

  const privacyCheckbox = (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={privacyAccepted}
          onChange={(e) => handlePrivacyChange(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-cyan focus:ring-cyan cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-gray-600">
          {tf.privacy.label}{" "}
          <Link to={privacyLink} className="text-cyan underline underline-offset-2" target="_blank">
            {tf.privacy.link_text}
          </Link>
        </span>
      </label>
      {errors.privacy && <p className="text-red-500 text-sm mt-2">{errors.privacy}</p>}
    </div>
  );

  const errorBanner = submitError && (
    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
      <p className="text-sm text-red-700">{tf.submit_error}</p>
      <a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-green-600 hover:text-green-700"
      >
        <FaWhatsapp className="w-4 h-4" />
        {tf.submit_error_whatsapp}
      </a>
    </div>
  );

  const steps = isShort ? tf.steps_short : tf.steps;

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-navy mb-2">{tf.title}</h2>
      <p className="text-gray-500 text-sm mb-6">{tf.subtitle}</p>

      {/* Progressbar */}
      <div className="flex items-center gap-4 mb-8">
        {steps.map((label, idx) => (
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
            {idx < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${idx < currentStep ? "bg-cyan" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {honeypotField}

        {/* ── PASO 1: Datos de contacto ── */}
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
                  {tf.step1.fields.email.label}{" "}
                  {isShort
                    ? <span className="text-gray-400 font-normal">({tf.optional_hint})</span>
                    : <span className="text-cyan">*</span>}
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

        {/* ── PASO 2: Tu reto ── */}
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

            {isShort && (
              <>
                {sectorSelector}
                {privacyCheckbox}
                {errorBanner}
              </>
            )}

            <div className="flex gap-4">
              <button type="button" onClick={prevStep}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {tf.step2.prev_button}
              </button>
              {isShort ? (
                <button type="submit" disabled={submitting}
                  className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all"
                >
                  {submitting ? tf.step3.submitting : tf.step3.submit_button}
                </button>
              ) : (
                <button type="button" onClick={nextStep}
                  disabled={!selectedReto}
                  className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all"
                >
                  {tf.step2.next_button}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── PASO 3: Contexto (completo) / ampliación opcional (corto) ── */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {isShort && leadSent && (
              <p className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                {tf.short_extend_hint}
              </p>
            )}

            {planSelector}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {tf.step3.volumen_clientes.question}{" "}
                {!isShort && <span className="text-cyan">*</span>}
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
                {tf.step3.urgencia.question}{" "}
                {!isShort && <span className="text-cyan">*</span>}
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

            {isShort ? messageField : (
              <>
                {sectorSelector}
                {messageField}
              </>
            )}

            {!isShort && privacyCheckbox}
            {errorBanner}

            <div className="flex gap-4">
              <button type="button" onClick={prevStep}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {tf.step3.prev_button}
              </button>
              <button type="submit" disabled={submitting}
                className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                {submitting
                  ? tf.step3.submitting
                  : isShort ? tf.step3.update_button : tf.step3.submit_button}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Modo corto: tras el primer envío, avanza al paso opcional de ampliación */}
      {isShort && leadSent && currentStep === 1 && (
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="mt-4 text-sm text-cyan font-semibold hover:underline"
        >
          {tf.short_extend_link}
        </button>
      )}

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
