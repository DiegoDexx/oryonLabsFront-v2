import { useState, useEffect, useRef } from 'react';

/**
 * Hook useCountUp — Animación de contador numérico
 * 
 * Uso:
 * const { ref, value, startCounting } = useCountUp({
 *   end: 2400,
 *   duration: 2000,
 *   suffix: 'k',
 *   prefix: ''
 * });
 * 
 * @param {object} options
 * @param {number} options.end - Valor final del contador
 * @param {number} options.start - Valor inicial (default: 0)
 * @param {number} options.duration - Duración en ms (default: 2000)
 * @param {string} options.suffix - Sufijo (ej: 'k', '%', '€')
 * @param {string} options.prefix - Prefijo (ej: '+', '-')
 * @param {boolean} options.startOnView - Si debe iniciar al entrar en viewport
 * @returns {object} { ref, value, formattedValue, isCounting, startCounting }
 */
export function useCountUp({
  end,
  start = 0,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  startOnView = false
} = {}) {
  const [value, setValue] = useState(start);
  const [isCounting, setIsCounting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const startCounting = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsCounting(true);
    startTimeRef.current = null;
  };

  useEffect(() => {
    if (!hasStarted) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = start + (end - start) * easeOutQuart;
      setValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(end);
        setIsCounting(false);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [hasStarted, start, end, duration]);

  // Start on view functionality
  useEffect(() => {
    if (!startOnView || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  // Format value
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(decimals).replace(/\.0+$/, '') + 'k';
    }
    return num.toFixed(decimals).replace(/\.0+$/, '');
  };

  const formattedValue = `${prefix}${formatNumber(value)}${suffix}`;

  return {
    ref,
    value,
    formattedValue,
    isCounting,
    startCounting
  };
}

export default useCountUp;
