import { useLocation } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import useContactPhone from '../hooks/useContactPhone';
import es from '../locales/contact/es.json';
import en from '../locales/contact/en.json';
import homeEs from '../locales/home/es.json';
import homeEn from '../locales/home/en.json';
import { seoData } from '../seo/seoData';
import HelmetSEO from '../seo/HelmetSEO';
import ProjectRequestForm from '../components/forms';

const translationsByLang = { es, en };
const homeTranslationsByLang = { es: homeEs, en: homeEn };

export default function ContactoPage() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const contact = (homeTranslationsByLang[lang] || homeTranslationsByLang.es).footer.contact;
  const { phone: contactPhone } = useContactPhone();
  const seo = seoData[lang]?.contacto;

  return (
    <div className="bg-white min-h-screen">
      {seo && <HelmetSEO {...seo} />}

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
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-300 hover:text-cyan transition-colors">
                <span className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="w-4 h-4 text-cyan" />
                </span>
                <span>
                  <span className="block text-xs text-gray-400">{t.info.phone_label}</span>
                  {contactPhone}
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

          {/* Formulario unificado (el mismo que home y landings de campaña) */}
          <div className="lg:col-span-3">
            <ProjectRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
