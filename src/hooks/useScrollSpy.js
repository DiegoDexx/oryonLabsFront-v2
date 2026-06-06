import { useState, useEffect, useCallback } from 'react';

/**
 * Hook useScrollSpy — Detecta qué sección está visible en el viewport
 * 
 * Uso:
 * const activeSection = useScrollSpy(['hero', 'services', 'pricing', 'contact']);
 * 
 * // En navegación:
 * <a href="#services" className={activeSection === 'services' ? 'text-cyan' : ''}>
 *   Servicios
 * </a>
 * 
 * @param {string[]} sectionIds - Array de IDs de secciones a observar
 * @param {object} options
 * @param {number} options.offset - Offset en px desde el top (para navbar sticky)
 * @param {number} options.threshold - Porcentaje de sección visible (default: 0.3)
 * @returns {string} ID de la sección activa
 */
export function useScrollSpy(
  sectionIds,
  { offset = 100, threshold = 0.3 } = {}
) {
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + offset;

    // Encontrar la sección más cercana al scroll position
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const sectionId = sectionIds[i];
      const element = document.getElementById(sectionId);

      if (element) {
        const { offsetTop, offsetHeight } = element;
        
        // Si el scroll está dentro de esta sección (con threshold)
        const sectionTop = offsetTop;
        const sectionBottom = offsetTop + offsetHeight;
        const visibleHeight = offsetHeight * threshold;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom - visibleHeight) {
          setActiveSection(sectionId);
          return;
        }
      }
    }

    // Si estamos arriba de todo, activar la primera sección
    if (scrollPosition < offset) {
      setActiveSection(sectionIds[0] || '');
    }
  }, [sectionIds, offset, threshold]);

  useEffect(() => {
    // Ejecutar inmediatamente para estado inicial
    handleScroll();

    // Agregar listener con throttling para rendimiento
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [handleScroll]);

  return activeSection;
}

export default useScrollSpy;
