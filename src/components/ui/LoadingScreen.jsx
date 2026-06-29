import logo from '../../assets/img/logo_blue_ox.webp';

export default function LoadingScreen() {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-10 select-none overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
    >

      {/* ── Orbs flotantes de fondo ── */}

      {/* Orb 1 — azul grande, arriba-derecha */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-100px',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,144,201,0.32) 0%, transparent 65%)',
        filter: 'blur(64px)',
        willChange: 'transform',
        animation: 'orbFloat1 11s ease-in-out infinite',
      }} />

      {/* Orb 2 — cyan mediano, abajo-izquierda */}
      <div style={{
        position: 'absolute',
        bottom: '-80px',
        left: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 65%)',
        filter: 'blur(52px)',
        willChange: 'transform',
        animation: 'orbFloat2 14s ease-in-out infinite',
      }} />

      {/* Orb 3 — azul oscuro pequeño, centro-izquierda */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '8%',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,80,180,0.22) 0%, transparent 65%)',
        filter: 'blur(44px)',
        willChange: 'transform',
        animation: 'orbFloat3 8s ease-in-out infinite',
      }} />

      {/* ── Contenido centrado ── */}

      {/* Logo con glow horizontal y shimmer */}
      <div className="relative flex items-center justify-center" style={{ width: '320px', height: '100px' }}>

        {/* Glow difuso detrás del logo */}
        <div
          className="absolute"
          style={{
            width: '340px',
            height: '70px',
            background: 'radial-gradient(ellipse at center, rgba(0,144,201,0.75) 0%, rgba(56,189,248,0.25) 50%, transparent 72%)',
            filter: 'blur(18px)',
            animation: 'glowPulse 2.2s ease-in-out infinite',
          }}
        />

        {/* Logo */}
        <img
          src={logo}
          alt="OryonX"
          width="203"
          height="72"
          fetchpriority="high"
          style={{
            height: '72px',
            width: 'auto',
            position: 'relative',
            filter: 'drop-shadow(0 0 22px rgba(0,144,201,0.55)) brightness(1.1)',
            animation: 'logoFadeIn 0.7s ease-out forwards',
          }}
        />
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          width: '200px',
          height: '2px',
          borderRadius: '9999px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #0090C9, #38BDF8)',
            animation: 'loadBar 1.7s ease-in-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0px, 0px);    }
          33%       { transform: translate(22px, -18px); }
          66%       { transform: translate(-12px, 12px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0px, 0px);     }
          50%       { transform: translate(-20px, -14px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0px, 0px);    }
          40%       { transform: translate(14px, -22px); }
          80%       { transform: translate(-8px, 10px);  }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scaleX(0.88); }
          50%       { opacity: 0.6;  transform: scaleX(1.1);  }
        }
        @keyframes logoFadeIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes loadBar {
          0%   { width: 0%;   }
          40%  { width: 55%;  }
          70%  { width: 75%;  }
          90%  { width: 90%;  }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
