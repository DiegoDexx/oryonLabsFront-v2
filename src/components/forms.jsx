import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaRobot, FaNetworkWired, FaPlug, FaMagic, FaQuestionCircle } from "react-icons/fa";
import SuccessModal from "./successModal";
import ProjectRequirementsFields from "./ProjectRequirementsFields";

const steps = ["Datos", "Categoría", "Requisitos"];

const CATEGORIES = [
  {
    key: "chatbot_ia",
    title: "Chatbot IA",
    desc: "Agentes conversacionales para atención al cliente, soporte y ventas.",
    Icon: <FaRobot className="w-8 h-8" />,
  },
  {
    key: "automatizacion_procesos",
    title: "Automatización de procesos",
    desc: "Workflows con n8n/Make para eliminar tareas repetitivas.",
    Icon: <FaNetworkWired className="w-8 h-8" />,
  },
  {
    key: "integracion_sistemas",
    title: "Integración de sistemas",
    desc: "Conexión entre CRMs, herramientas y APIs en un ecosistema unificado.",
    Icon: <FaPlug className="w-8 h-8" />,
  },
  {
    key: "agente_ia_personalizado",
    title: "Agente IA personalizado",
    desc: "Asistentes GPT entrenados específicamente para tu negocio y sector.",
    Icon: <FaMagic className="w-8 h-8" />,
  },
  {
    key: "otros",
    title: "Otros",
    desc: "Proyectos personalizados que no encajan en las categorías anteriores.",
    Icon: <FaQuestionCircle className="w-8 h-8" />,
  },
];

const ProjectRequestForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fieldsByCategory, setFieldsByCategory] = useState({});
  const [formValues, setFormValues] = useState({});
  const [projectName, setProjectName] = useState("");
  const [loadingFields, setLoadingFields] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!selectedCategory) return;
    if (fieldsByCategory[selectedCategory]) return;

    setLoadingFields(true);
    axios.get(`https://oryonlabsdb-production.up.railway.app/api/project-fields/category/${selectedCategory}`)
      .then(res => {
        const arr = res.data.data || [];
        setFieldsByCategory(prev => ({ ...prev, [selectedCategory]: arr }));

        const init = {};
        arr.forEach(f => {
          init[f.field_name] = f.type === "boolean" ? false : "";
        });
        setFormValues(prev => ({ ...init, ...prev }));
      })
      .catch(err => console.error("Error cargando fields:", err))
      .finally(() => setLoadingFields(false));
  }, [selectedCategory]);

  const categoryFields = useMemo(() => fieldsByCategory[selectedCategory] || [], [fieldsByCategory, selectedCategory]);

  const validateStep0 = () => {
    const e = {};
    if (!clientName.trim()) e.clientName = "El nombre es obligatorio.";
    if (!clientEmail.trim()) e.clientEmail = "El email es obligatorio.";
    if (!clientCompany.trim()) e.clientCompany = "La empresa es obligatoria.";
    if (!clientPhone.trim()) e.clientPhone = "El teléfono es obligatorio.";
    
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail);
    const phoneValid = /^[0-9]{7,15}$/.test(clientPhone);
    
    if (!emailValid) e.clientEmail = "Correo inválido.";
    if (!phoneValid) e.clientPhone = "Teléfono inválido (solo números, 7-15 dígitos).";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e = {};
    if (!selectedCategory) e.category = "Selecciona una categoría.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    categoryFields.forEach((f) => {
      if (f.required) {
        const v = formValues[f.field_name];
        const empty =
          (f.type === "boolean" && typeof v !== "boolean") ||
          (f.type !== "boolean" && (v === null || v === undefined || v === ""));
        if (empty) e[f.field_name] = "Campo obligatorio.";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 0 && !validateStep0()) return;
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const onChangeValue = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      setSubmitting(true);

      const clientResponse = await axios.post("https://oryonlabsdb-production.up.railway.app/api/clients", {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        company: clientCompany,
      });
      const clientId = clientResponse.data.id;

      const requirements = categoryFields.map((f) => ({
        field_id: f.id ?? f.field_id,
        value: formValues[f.field_name],
      }));

      const payload = {
        name: projectName,
        client_id: clientId,
        category: selectedCategory,
        requirements,
      };

      await axios.post(
        "https://oryonlabsdb-production.up.railway.app/api/projects",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setCurrentStep(0);
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setClientCompany("");
      setProjectName("");
      setSelectedCategory("");
      setFieldsByCategory({});
      setFormValues({});
      setErrors({});
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Error al enviar el proyecto:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-navy mb-2">Cuéntanos tu proyecto</h2>
      <p className="text-gray-500 text-sm mb-6">Todos los campos con * son obligatorios.</p>

      {/* Progressbar */}
      <div className="flex items-center gap-4 mb-8">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                idx < currentStep ? 'bg-cyan text-white' : 
                idx === currentStep ? 'bg-cyan text-white ring-4 ring-cyan/20' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${idx <= currentStep ? 'text-cyan' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${idx < currentStep ? 'bg-cyan' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo <span className="text-cyan">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa <span className="text-cyan">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nombre de tu empresa"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientCompany && <p className="text-red-500 text-sm mt-1">{errors.clientCompany}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email corporativo <span className="text-cyan">*</span>
                </label>
                <input
                  type="email"
                  placeholder="tu@empresa.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-cyan">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+34 600 000 000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.clientPhone && <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-3 rounded-lg transition-all w-full sm:w-auto"
            >
              Siguiente
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                ¿Qué necesitas automatizar? <span className="text-cyan">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map(({ key, title, desc, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`p-6 rounded-xl border-2 text-left transition-all group ${
                      selectedCategory === key
                        ? 'border-cyan bg-cyan-pale'
                        : 'border-gray-200 hover:border-cyan/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`mb-4 ${selectedCategory === key ? 'text-cyan' : 'text-gray-400 group-hover:text-cyan'}`}>
                      {Icon}
                    </div>
                    <h4 className="font-semibold text-navy mb-1">{title}</h4>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </button>
                ))}
              </div>

              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del proyecto <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                placeholder="¿Cómo quieres llamar a este proyecto?"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!selectedCategory || !projectName}
                className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <ProjectRequirementsFields
            selectedCategory={selectedCategory}
            loadingFields={loadingFields}
            categoryFields={categoryFields}
            formValues={formValues}
            onChangeValue={onChangeValue}
            errors={errors}
            prevStep={prevStep}
            submitting={submitting}
          />
        )}
      </form>

      <p className="text-center text-gray-400 text-xs mt-8">
        Sin spam. Sin compromiso. Solo hablamos de automatización.
      </p>

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="¡Solicitud enviada correctamente! Pronto contactaremos contigo."
        />
      )}
    </div>
  );
};

export default ProjectRequestForm;
