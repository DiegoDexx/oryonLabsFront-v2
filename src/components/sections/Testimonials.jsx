import { AnimatedSection } from '../ui/AnimatedSection';
import { StaggerContainer } from '../ui/StaggerContainer';
// import { useTranslation } from '../../hooks/useTranslation'; // TODO: Habilitar en Fase 2 final

// Star icon
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Quote icon
const QuoteIcon = () => (
  <svg className="w-8 h-8 text-cyan/20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
  </svg>
);

// Datos de testimonios
const testimonials = [
  {
    quote: 'En 3 semanas pasamos de perder el 40% de leads por respuesta tardía a capturarlos automáticamente 24/7.',
    name: 'María Gómez',
    company: 'Inmobiliaria Viva',
    result: '+40% leads en 30 días',
    rating: 5
  },
  {
    quote: 'Oryon Labs automatizó nuestro sistema de citas y seguimiento. Ahora nuestro equipo se enfoca en atender, no en administrar.',
    name: 'Dr. Carlos Ruiz',
    company: 'Clínica BeautyMed',
    result: 'Ahorramos 3h/día',
    rating: 5
  },
  {
    quote: 'El chatbot cualifica leads antes de que hablen con nosotros. La calidad de las oportunidades mejoró drásticamente.',
    name: 'Laura Martínez',
    company: 'E-Shop Style',
    result: 'ROI 300% en 60 días',
    rating: 5
  }
];

export default function Testimonials() {
  // const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-white/10 text-cyan-light text-sm font-semibold px-4 py-2 rounded-full mb-4 sm:mb-6">
            Casos de éxito
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Resultados reales de empresas que automatizaron con Oryon Labs.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <StaggerContainer 
          staggerDelay={200}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-cyan/30 hover:bg-white/10 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <QuoteIcon />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-white text-base sm:text-lg leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Result Badge */}
              <div className="inline-block bg-cyan/20 text-cyan-light text-sm font-semibold px-3 py-1 rounded-full mb-6">
                {testimonial.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 flex items-center justify-center text-cyan font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
