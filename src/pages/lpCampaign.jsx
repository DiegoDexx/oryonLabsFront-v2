import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import ProjectRequestForm from '../components/forms';
import HelmetSEO from '../seo/HelmetSEO';
import useContactPhone from '../hooks/useContactPhone';
import { captureUtmParams, getStoredUtm } from '../utils/tracking';
import homeEs from '../locales/home/es.json';
import homeEn from '../locales/home/en.json';
import campEs from '../locales/campaign/es.json';
import campEn from '../locales/campaign/en.json';

const homeByLang = { es: homeEs, en: homeEn };
const campByLang = { es: campEs, en: campEn };

const BASE_URL = 'https://oryonx.ai';

/**
 * Landing page para tráfico de pago (Instagram / TikTok Ads).
 * Ruta: /:lang/lp/:campaign — sin Navbar, Footer, Breadcrumb ni StickyMobileCTA
 * (Layout la excluye por el segmento "lp"). noindex, nofollow.
 */
export default function LpCampaign() {
  const location = useLocation();
  const { lang: paramLang, campaign } = useParams();
  const lang = ['es', 'en'].includes(paramLang) ? paramLang : 'es';
  const home = homeByLang[lang] || homeEs;
  const campaigns = campByLang[lang] || campEs;
  const copy = campaigns[campaign] || campaigns.default;
  const testimonial = home.why.testimonial;
  const { phone } = useContactPhone();

  // Captura UTM al entrar (la LP es la puerta de entrada del tráfico de pago)
  useEffect(() => {
    captureUtmParams(location.search);
  }, [location.search]);

  // channel según utm_source: instagram_ads / tiktok_ads / form
  const utmSource = (getStoredUtm().utm_source || '').toLowerCase();
  const channel =
    utmSource.includes('instagram') || utmSource.includes('ig')
      ? 'instagram_ads'
      : utmSource.includes('tiktok')
        ? 'tiktok_ads'
        : 'form';

  const waNumber = phone.replace(/[^\d]/g, '');

  return (
    <div className="bg-navy min-h-screen">
      <HelmetSEO
        title={`${copy.headline} | OryonX`}
        description={copy.subhead}
        url={`${BASE_URL}/${lang}/lp/${campaign}`}
        image={`${BASE_URL}/og-image-${lang}.png`}
        lang={lang}
        robots="noindex, nofollow"
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pt-14 pb-10 text-white">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.18) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.12] mb-4">
            {copy.headline}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {copy.subhead}
          </p>
        </div>
      </section>

      {/* ── Beneficios ───────────────────────────────────────── */}
      <section className="px-5 pb-10">
        <div className="max-w-2xl mx-auto space-y-4">
          {copy.benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
              <FaCheckCircle className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm mb-1">{b.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonio ───────────────────────────────────────── */}
      <section className="px-5 pb-12">
        <figure className="max-w-2xl mx-auto bg-navy-light border border-cyan/20 rounded-2xl p-6 sm:p-8">
          <blockquote className="text-gray-200 text-base sm:text-lg leading-relaxed mb-4">
            “{testimonial.text}”
          </blockquote>
          <figcaption className="text-cyan-light text-sm font-medium">
            {testimonial.author}
          </figcaption>
        </figure>
      </section>

      {/* ── Formulario (modo corto) ──────────────────────────── */}
      <section className="px-5 pb-14">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-10 shadow-2xl">
          <ProjectRequestForm variant="short" channel={channel} />
        </div>

        {/* Alternativa WhatsApp */}
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:opacity-90 text-white font-semibold px-8 py-3.5 rounded-lg transition-all"
          >
            <FaWhatsapp className="w-5 h-5" />
            {copy.whatsapp_cta}
          </a>
        </div>
      </section>
    </div>
  );
}
