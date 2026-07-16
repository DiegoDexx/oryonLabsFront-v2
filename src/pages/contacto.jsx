import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import es from '../locales/contacto/es.json';
import en from '../locales/contacto/en.json';
import homeEs from '../locales/home/es.json';
import homeEn from '../locales/home/en.json';
import { seoData } from '../seo/seoData';
import HelmetSEO from '../seo/HelmetSEO';
import SuccessModal from '../components/successModal';

const translationsByLang = { es, en };
const homeTranslationsByLang = { es: homeEs, en: homeEn };

export default function ContactoPage() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const contact = (homeTranslationsByLang[lang] || homeTranslationsByLang.es).footer.contact;
  const seo = seoData[lang]?.contacto;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = () => {
    const e = {};
    const tf = t.form;
    if (!name.trim()) e.name = tf.name.error;
    if (!email.trim()) e.email = tf.email.error_required;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = tf.email.error_invalid;
    if (!message.trim()) e.message = tf.message.error;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // TODO: connect real submission (email service or CRM webhook) once backend is defined.
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccessModal(true);
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setMessage('');
      setErrors({});
    }, 500);
  };

  return (
    <div className="bg-white min-h-screen">
      {seo && (
        <HelmetSEO
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          url={seo.url}
          lang={lang}
          alternates={seo.alternates}
        />
      )}

      {/* ── Hero corto ──────────────────────────────────────── */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.12) 0%, transparent 70%)' }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-pale px-4 py-2 text-cyan-dark text-sm font-semibold mb-6">
            {t.hero.eyebrow}
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-[1.08]">{t.hero.title}</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">{t.hero.subtitle}</p>
        </div>
      </section>

      {/* ── Formulario + info ───────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info directa */}
          <div className="lg:col-span-2 bg-navy rounded-2xl p-8 lg:p-10 text-white h-fit">
            <h2 className="text-xl font-bold mb-8">{t.info.title}</h2>
            <div className="space-y-6">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="w-4 h-4 text-cyan" />
                </span>
                <span>
                  <span className="block text-xs text-gray-400">{t.info.email_label}</span>
                  {contact.email}
                </span>
              </a>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-4 h-4 text-cyan" />
                </span>
                <span>
                  <span className="block text-xs text-gray-400">{t.info.phone_label}</span>
                  {contact.phone}
                </span>
              </a>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-4 h-4 text-cyan" />
                </span>
                <span>
                  <span className="block text-xs text-gray-400">{t.info.whatsapp_label}</span>
                  {contact.whatsapp}
                </span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.name.label} <span className="text-cyan">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.form.name.placeholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.email.label} <span className="text-cyan">*</span>
                </label>
                <input
                  type="email"
                  placeholder={t.form.email.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.company.label}
                </label>
                <input
                  type="text"
                  placeholder={t.form.company.placeholder}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.phone.label}
                </label>
                <input
                  type="text"
                  placeholder={t.form.phone.placeholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.message.label} <span className="text-cyan">*</span>
              </label>
              <textarea
                rows={5}
                placeholder={t.form.message.placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700 resize-none"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-lg transition-all w-full sm:w-auto"
            >
              {submitting ? t.form.submitting : t.form.submit}
            </button>
          </form>
        </div>
      </section>

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={t.form.success_title}
          message={t.form.success_message}
        />
      )}
    </div>
  );
}
