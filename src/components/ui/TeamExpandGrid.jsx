import { useState } from 'react';

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

const AVATAR_COLORS = {
  navy: 'bg-navy text-white',
  cyan: 'bg-cyan text-white',
};

function Avatar({ name, photo, color, className = '' }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`w-full h-full flex items-center justify-center font-bold ${
        AVATAR_COLORS[color] || AVATAR_COLORS.cyan
      } ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

// Pure-CSS accordion reveal (grid-template-rows 0fr -> 1fr) — animates smoothly
// without needing to know the bio's rendered height, no animation library required.
function BioReveal({ active, children }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-300 ease-out"
      style={{ gridTemplateRows: active ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function BioPanel({ bio }) {
  return (
    <div className="border-l-4 border-cyan bg-cyan-pale/60 rounded-r-xl p-4">
      <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>
    </div>
  );
}

export default function TeamExpandGrid({ members }) {
  const [activeId, setActiveId] = useState(members[0]?.id);

  const toggle = (id) => setActiveId(id);
  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <>
      {/* ── Desktop: 3 columns, active one grows ──────────────── */}
      <div className="hidden md:flex gap-5 items-start">
        {members.map((m) => {
          const active = m.id === activeId;
          return (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => toggle(m.id)}
              onKeyDown={(e) => handleKeyDown(e, m.id)}
              className={`cursor-pointer rounded-[28px] overflow-hidden border bg-white shadow-sm transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 ${
                active ? 'border-cyan/30 shadow-lg' : 'border-gray-200 hover:border-cyan/30'
              }`}
              style={{ flexGrow: active ? 2.4 : 1, flexBasis: 0, minWidth: 0 }}
            >
              <div className="w-full h-72 overflow-hidden bg-slate-100">
                <Avatar name={m.name} photo={m.photo} color={m.color} className="text-3xl" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-navy leading-snug">{m.name}</h3>
                <p className="text-cyan text-sm font-semibold mt-0.5">{m.role}</p>
                <BioReveal active={active}>
                  <div className="mt-4">
                    <BioPanel bio={m.bio} />
                  </div>
                </BioReveal>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: stacked accordion ──────────────────────────── */}
      <div className="md:hidden space-y-4">
        {members.map((m) => {
          const active = m.id === activeId;
          return (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => toggle(m.id)}
              onKeyDown={(e) => handleKeyDown(e, m.id)}
              className={`rounded-[24px] border bg-white shadow-sm overflow-hidden cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 ${
                active ? 'border-cyan/30 shadow-md' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cyan-pale bg-slate-100">
                  <Avatar name={m.name} photo={m.photo} color={m.color} className="text-base" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-navy text-sm leading-snug truncate">{m.name}</h3>
                  {/* No truncate here — role titles are real information
                      ("CEO & Founder — Sales & Financial Dept."), cutting
                      them off with an ellipsis loses content rather than
                      just visually tightening the row. Let it wrap. */}
                  <p className="text-cyan text-xs font-semibold leading-snug">{m.role}</p>
                </div>
              </div>
              <BioReveal active={active}>
                <div className="px-4 pb-4">
                  <BioPanel bio={m.bio} />
                </div>
              </BioReveal>
            </div>
          );
        })}
      </div>
    </>
  );
}
