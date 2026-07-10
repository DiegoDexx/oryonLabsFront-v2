export default function MockupFrame({ children, rounded = 'rounded-[1.5rem]', className = '' }) {
  return (
    <div
      className={`relative ${rounded} border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-2xl shadow-black/50 ${className}`}
    >
      {children}
    </div>
  );
}
