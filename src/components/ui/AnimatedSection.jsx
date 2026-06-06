import { useInView } from '../../hooks/useInView';

/**
 * AnimatedSection — Wrapper con animación fade-in + slide-up
 * 
 * Uso:
 * <AnimatedSection delay={0}>
 *   <YourContent />
 * </AnimatedSection>
 * 
 * <AnimatedSection delay={100} className="custom-class">
 *   <YourContent />
 * </AnimatedSection>
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.delay - Delay en ms antes de iniciar animación
 * @param {string} props.className - Clases adicionales
 * @param {object} props.inViewOptions - Opciones para useInView
 * @returns {JSX.Element}
 */
export function AnimatedSection({
  children,
  delay = 0,
  className = '',
  threshold = 0.2,
  triggerOnce = true
}) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}

export default AnimatedSection;
