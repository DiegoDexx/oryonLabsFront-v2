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
      {/* items-stretch (the flex default, stated explicitly here since it's
          load-bearing) so all 3 cards always share the row's tallest height
          — driven by whichever card is active/has its bio open. */}
      <div className="hidden md:flex gap-5 items-stretch">
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
              className={`flex flex-col cursor-pointer rounded-[28px] overflow-hidden border-2 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 ${
                active
                  ? 'border-cyan bg-cyan-pale/20 shadow-lg shadow-cyan/15'
                  : 'border-gray-200 bg-white shadow-sm hover:border-cyan/40'
              }`}
              style={{ flexGrow: active ? 2.4 : 1, flexBasis: 0, minWidth: 0 }}
            >
              {/* Fixed portrait aspect-ratio at all times — only the
                  column's width changes when a card becomes active, never
                  the photo's crop/shape. Uses the padding-top percentage
                  technique rather than the `aspect-ratio` property: nested
                  inside a stretched flex row + flex-grow'd flex-col, plain
                  `aspect-ratio` measurably resolved to the wrong ratio for
                  some cards (a real layout bug, verified via getBoundingClientRect,
                  not just a visual guess). Padding-percentage height is
                  derived purely from the resolved width, sidestepping that.
                  No radius of its own: relies on the card's own
                  rounded+overflow-hidden for its corners, so they can't
                  drift out of alignment. */}
              <div className="relative w-full flex-shrink-0 bg-slate-100" style={{ paddingTop: '133.333%' }}>
                <div className="absolute inset-0">
                  <Avatar name={m.name} photo={m.photo} color={m.color} className="text-3xl" />
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-start">
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
