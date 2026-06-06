import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook useInView — Detecta cuando un elemento entra en el viewport
 * 
 * Uso:
 * const { ref, inView, hasAnimated } = useInView({ threshold: 0.2, triggerOnce: true });
 * 
 * return (
 *   <div ref={ref} className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
 *     Content
 *   </div>
 * );
 * 
 * @param {object} options
 * @param {number} options.threshold - Porcentaje visible para disparar (0-1)
 * @param {string} options.rootMargin - Margen adicional (ej: '-100px')
 * @param {boolean} options.triggerOnce - Si solo debe disparar una vez
 * @returns {object} { ref, inView, hasAnimated, entry }
 */
export function useInView({
  threshold = 0.2,
  rootMargin = '0px',
  triggerOnce = true
} = {}) {
  const [inView, setInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    setEntry(entry);
    
    const isIntersecting = entry.isIntersecting;
    setInView(isIntersecting);

    if (isIntersecting && triggerOnce) {
      setHasAnimated(true);
      // Desconectar observer si solo se dispara una vez
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  }, [triggerOnce]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Crear observer con opciones
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(element);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, handleIntersection]);

  return {
    ref,
    inView: triggerOnce ? (hasAnimated || inView) : inView,
    hasAnimated,
    entry
  };
}

export default useInView;
