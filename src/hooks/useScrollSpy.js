import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds, { offset = 100, threshold = 0.3 } = {}) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (!sectionIds.length) return;

    // bottomMargin pushes the intersection zone up so only the top portion of the
    // viewport (below the navbar) triggers a section as "active"
    const bottomMargin = Math.round((1 - threshold) * 100);
    const visible = new Set();

    const pickActive = () => {
      const first = sectionIds.find((id) => visible.has(id));
      setActiveSection(first ?? '');
    };

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([entry]) => {
          entry.isIntersecting ? visible.add(id) : visible.delete(id);
          pickActive();
        },
        { rootMargin: `-${offset}px 0px -${bottomMargin}% 0px`, threshold: 0 }
      );
      io.observe(el);
      return io;
    });

    return () => observers.forEach((io) => io?.disconnect());
    // sectionIds identity changes on every Navbar render — serialize for stable comparison
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sectionIds), offset, threshold]);

  return activeSection;
}

export default useScrollSpy;
