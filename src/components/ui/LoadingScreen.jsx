import logo from '../../assets/img/logo_blue_ox.webp';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 select-none">

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

        {/* Shimmer que cruza el logo */}
        <div
          className="absolute overflow-hidden"
          style={{ width: '300px', height: '90px', borderRadius: '8px' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-120%',
              width: '55%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
              animation: 'shimmer 2.6s ease-in-out infinite 0.6s',
            }}
          />
        </div>

        {/* Logo */}
        <img
          src={logo}
          alt="OryonX"
          style={{
            height: '72px',
            width: 'auto',
            position: 'relative',
            filter: 'drop-shadow(0 0 22px rgba(0,144,201,0.55)) brightness(1.1)',
            animation: 'logoFadeIn 0.7s ease-out forwards',
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          color: 'rgba(156,163,175,0.55)',
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.42em',
          animation: 'taglineFade 1s ease-out 0.5s both',
        }}
      >
        Iniciando sistema
      </p>

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
            animation: 'loadBar 2.8s ease-in-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scaleX(0.88); }
          50%       { opacity: 0.6;  transform: scaleX(1.1);  }
        }
        @keyframes shimmer {
          0%   { left: -120%; }
          100% { left: 220%;  }
        }
        @keyframes logoFadeIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes taglineFade {
          0%   { opacity: 0; }
          100% { opacity: 1; }
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
