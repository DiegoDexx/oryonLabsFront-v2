import { useLocation } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';
import es from '../../locales/home/es.json';
import en from '../../locales/home/en.json';

const translationsByLang = { es, en };

// Iconos Lucide
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
);
const WrenchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

const icons = [SearchIcon, PaletteIcon, WrenchIcon, TrendingUpIcon];

export default function Process() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const process = t.process;

  return (
    <section id={lang === 'en' ? 'process' : 'proceso'} className="py-16 sm:py-20 lg:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-cyan-pale text-cyan-dark text-sm font-semibold px-4 py-2 rounded-full mb-4 sm:mb-6">
            {process.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {process.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            {process.description}
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="relative">
          {/* Conector line en desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {process.steps.map((step, index) => {
              const IconComponent = icons[index];
              return (
                <AnimatedSection key={step.number} delay={index * 150}>
                  <div className="relative group h-full">
                    {/* Card */}
                    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm h-full hover:border-cyan/30 hover:bg-white/10 transition-all duration-300">
                      {/* Number */}
                      <span className="absolute top-4 right-4 text-5xl font-bold text-white/5 group-hover:text-cyan/10 transition-colors">
                        {step.number}
                      </span>
                      
                      {/* Icon */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-cyan group-hover:text-white transition-all duration-300">
                        <IconComponent />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-extrabold text-white mb-2 sm:mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>

                      {/* Arrow indicator (excepto último) */}
                      {index < process.steps.length - 1 && (
                        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                          <div className="w-8 h-8 rounded-full bg-cyan text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
