import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedSection } from '../ui/AnimatedSection';
import { StaggerContainer } from '../ui/StaggerContainer';
import es from '../../locales/es.json';
import en from '../../locales/en.json';

const translationsByLang = { es, en };

// Plus/Minus icon component
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function FAQItem({ item, isOpen, onToggle, index }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full py-5 sm:py-6 flex items-center justify-between text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`text-base sm:text-lg font-semibold pr-4 transition-colors ${isOpen ? 'text-cyan' : 'text-white group-hover:text-cyan'}`}>
          {item.question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-cyan text-white rotate-0' 
            : 'bg-white/10 text-gray-300 group-hover:bg-cyan/10 group-hover:text-cyan'
        }`}>
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-5 sm:pb-6 text-gray-300 leading-relaxed pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const location = useLocation();
  const pathLang = location.pathname.split('/')[1];
  const lang = ['es', 'en'].includes(pathLang) ? pathLang : 'es';
  const t = translationsByLang[lang] || translationsByLang.es;
  const faq = t.faq;
  
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-cyan/10 text-cyan-light text-sm font-semibold px-4 py-2 rounded-full mb-4 sm:mb-6 border border-cyan/20">
            {faq.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {faq.title}
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            {faq.description}
          </p>
        </AnimatedSection>

        {/* FAQ List */}
        <AnimatedSection delay={100}>
          <div className="bg-navy-light/80 rounded-2xl shadow-sm border border-white/10 p-4 sm:p-6 lg:p-8">
            <StaggerContainer staggerDelay={50}>
              {faq.items.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={200} className="text-center mt-12">
          <p className="text-gray-300 mb-4">{faq.cta_title}</p>
          <a
            href={`/${lang}#${lang === 'en' ? 'contact' : 'contacto'}`}
            className="inline-flex items-center gap-2 bg-cyan hover:bg-cyan-medium text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            {faq.cta_button}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
