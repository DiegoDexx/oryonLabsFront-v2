import { lazy, Suspense, useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from '../ui/Breadcrumb';
import CookieBanner from '../ui/CookieBanner';
import StickyMobileCTA from '../ui/StickyMobileCTA';
import ExitIntent from '../ui/ExitIntent';

// Lazy load — el bundle de ChatWidget no se descarga hasta que el usuario interactúa
const ChatWidget = lazy(() => import('../ui/ChatWidget'));

export default function Layout() {
  const location = useLocation();
  const [chatReady, setChatReady] = useState(false);
  const [autoOpenChat, setAutoOpenChat] = useState(false);

  useEffect(() => {
    const activate = () => setChatReady(true);

    // Si alguien dispara open-chatbot antes del mount, carga y abre directamente
    const activateAndOpen = () => {
      setAutoOpenChat(true);
      setChatReady(true);
    };

    window.addEventListener('scroll',      activate,       { passive: true, once: true });
    window.addEventListener('mousemove',   activate,       { passive: true, once: true });
    window.addEventListener('touchstart',  activate,       { passive: true, once: true });
    window.addEventListener('open-chatbot', activateAndOpen, { once: true });

    // Fallback: cargar cuando el browser esté idle (no fuerza descarga durante render crítico)
    const fallback = 'requestIdleCallback' in window
      ? window.requestIdleCallback(activate, { timeout: 7000 })
      : setTimeout(activate, 6000);

    return () => {
      window.removeEventListener('scroll',       activate);
      window.removeEventListener('mousemove',    activate);
      window.removeEventListener('touchstart',   activate);
      window.removeEventListener('open-chatbot', activateAndOpen);
      'requestIdleCallback' in window
        ? window.cancelIdleCallback(fallback)
        : clearTimeout(fallback);
    };
  }, []);

  if (location.pathname.includes('adminpanel') || location.pathname.includes('login')) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Breadcrumb />
        <Outlet />
      </main>
      <Footer />
      {chatReady && (
        <Suspense fallback={null}>
          <ChatWidget autoOpen={autoOpenChat} />
        </Suspense>
      )}
      <CookieBanner />
      <StickyMobileCTA />
      <ExitIntent />
    </>
  );
}
