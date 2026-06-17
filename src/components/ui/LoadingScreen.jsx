import logo from '../../assets/img/original_logo_blue_ox.webp';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 select-none">

      {/* Logo con anillo giratorio + glow */}
      <div className="relative flex items-center justify-center">
        {/* Glow difuso */}
        <div
          className="absolute w-32 h-32 rounded-full opacity-40 animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(0,144,201,0.6) 0%, transparent 70%)' }}
        />

        {/* Anillo exterior giratorio */}
        <div
          className="absolute w-28 h-28 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#0090C9',
            borderRightColor: 'rgba(0,144,201,0.3)',
            animation: 'spin 1.2s linear infinite',
          }}
        />

        {/* Anillo interior giratorio inverso */}
        <div
          className="absolute w-20 h-20 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: '#38BDF8',
            borderLeftColor: 'rgba(56,189,248,0.2)',
            animation: 'spin 1.8s linear infinite reverse',
          }}
        />

        {/* Logo */}
     <img
        src={logo}
        alt="OryonX"
        width={56}
        height={56}
        className="relative w-14 h-14"
        style={{ filter: 'drop-shadow(0 0 16px rgba(0,144,201,0.7))' }}
      />
      </div>

      {/* Nombre */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-white font-black text-2xl tracking-tight leading-none">
          Oryon<span style={{ color: '#38BDF8' }}>X</span>
        </p>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.35em]"
          style={{ color: 'rgba(156,163,175,0.7)' }}
        >
          Iniciando sistema
        </p>
      </div>

      {/* Barra de progreso animada */}
      <div className="w-48 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #0090C9, #38BDF8)',
            animation: 'loadBar 2.8s ease-in-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes loadBar {
          0%   { width: 0%; }
          40%  { width: 55%; }
          70%  { width: 75%; }
          90%  { width: 90%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
