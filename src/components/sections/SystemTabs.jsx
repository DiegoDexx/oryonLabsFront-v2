import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaComments, FaLayerGroup, FaChartBar, FaMicrophone, FaCheckCircle, FaClock } from 'react-icons/fa';
import { AnimatedSection } from '../ui/AnimatedSection';
import { ChatWebMockup, MulticanalMockup, CRMMockup, VoiceMockup } from './SystemTabMockups';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };

const TAB_ICONS = [FaComments, FaLayerGroup, FaChartBar, FaMicrophone];
const TAB_MOCKUPS = [ChatWebMockup, MulticanalMockup, CRMMockup, VoiceMockup];

export default function SystemTabs() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const st = t.system_tabs;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = st.tabs[activeIndex];
  const ActiveMockup = TAB_MOCKUPS[activeIndex];

  return (
    <section id={lang === 'en' ? 'how-it-works' : 'como-funciona'} className="relative bg-navy py-24 overflow-hidden">
      {/* Background grid — same decorative language as "Por qué OryonX" so
          this section doesn't break the dark navy consistency of the page. */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,144,201,0.06),transparent_65%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-cyan text-xs font-bold uppercase tracking-[0.25em] mb-5">{st.badge}</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
            {st.title}
            <br />
            <span className="text-cyan">{st.title_highlight}</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">{st.subtitle}</p>
        </AnimatedSection>

        {/* Tab bar — grid columns are equal fractions of a fixed-width
            container, so the active tab's bg/font-weight change never
            resizes any column and the bar never reflows on switch. */}
        <AnimatedSection delay={60} className="flex justify-center mb-14">
          <div className="grid grid-cols-4 w-full max-w-2xl bg-white/5 border border-white/10 rounded-full p-1.5 gap-1">
            {st.tabs.map((tab, i) => {
              const Icon = TAB_ICONS[i];
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-pressed={isActive}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                    isActive ? 'bg-cyan text-navy' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{tab.tab_label}</span>
                </button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Content — remounts (key=activeIndex) on tab switch so the
            entrance fade replays, giving a light transition cue. */}
        <div key={activeIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <AnimatedSection>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">{activeTab.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-7">{activeTab.description}</p>
            <ul className="space-y-3.5 mb-8">
              {activeTab.checks.map((check, i) => {
                const isActive = check.status === 'active';
                return (
                  <li key={i} className="flex items-center gap-3">
                    {isActive ? (
                      <FaCheckCircle className="w-5 h-5 text-cyan flex-shrink-0" />
                    ) : (
                      <FaClock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                      {check.text}
                    </span>
                    {!isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {st.roadmap_badge}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              className="inline-flex items-center gap-2 bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3.5 rounded-lg transition-all shadow-lg shadow-cyan/20"
            >
              {st.cta}
            </button>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <ActiveMockup
              data={activeTab.mockup}
              roadmapLabel={st.roadmap_badge}
              illustrativeLabel={st.illustrative_label}
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
