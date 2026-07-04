import logoBlueOx from '../../assets/img/logo_blue_ox.webp';
import { useAdminT } from '../../context/AdminLangContext';

// ── Outline SVG icons ────────────────────────────────────────────────────────

const Icons = {
  dashboard: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  pipeline: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  leads: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  clients: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  projects: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  subscriptions: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  invoices: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  close: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// ── Nav structure ────────────────────────────────────────────────────────────

const NAV_STRUCTURE = [
  { key: 'dashboard' },
  { key: 'pipeline' },
  { type: 'section', labelKey: 'ventas' },
  { key: 'leads', hasBadge: true },
  { key: 'clients' },
  { key: 'projects' },
  { type: 'section', labelKey: 'ingresos' },
  { key: 'subscriptions' },
  { key: 'invoices' },
  { key: 'users' },
];

// ── Shared nav content ───────────────────────────────────────────────────────

const SidebarInner = ({ compact, selectedTab, onTabChange, leads, t, onClose }) => {
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-white/10 flex-shrink-0">
        <img src={logoBlueOx} alt="OryonX" className="h-7 w-auto object-contain flex-shrink-0" />
        {!compact && (
          <span className="text-sm font-bold leading-tight whitespace-nowrap">
            <span className="text-white">OryonX</span>
            <span className="text-crm-accent ml-1">CRM</span>
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-crm-muted hover:text-white transition-colors p-1 rounded"
            aria-label="Cerrar menú"
          >
            {Icons.close}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#15234A transparent' }}>
        {NAV_STRUCTURE.map((item, i) => {
          if (item.type === 'section') {
            if (compact) {
              return <div key={i} className="mx-2 my-3 h-px bg-white/10" />;
            }
            return (
              <p key={i} className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-crm-label select-none">
                {t.sidebar?.[item.labelKey] || item.labelKey.toUpperCase()}
              </p>
            );
          }

          const isActive = selectedTab === item.key;
          const badge = item.hasBadge && newLeadsCount > 0 ? newLeadsCount : 0;

          return (
            <button
              key={item.key}
              onClick={() => { onTabChange(item.key); onClose?.(); }}
              title={compact ? (t.tabs?.[item.key] || item.key) : undefined}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all group ${
                isActive
                  ? 'bg-crm-active'
                  : 'hover:bg-white/5'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-white' : 'text-crm-muted group-hover:text-white'}`}>
                {Icons[item.key]}
              </span>

              {!compact && (
                <span className={`flex-1 text-left text-sm transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-crm-muted group-hover:text-white'
                }`}>
                  {t.tabs?.[item.key] || item.key}
                </span>
              )}

              {/* Badge (collapsed: tiny dot; expanded: pill) */}
              {!compact && badge > 0 && (
                <span className="text-[11px] font-bold bg-blue-500/80 text-white px-1.5 py-0.5 rounded-full leading-none">
                  {badge}
                </span>
              )}
              {compact && badge > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
              )}

              {/* Active indicator dot — right side, inside pill */}
              {!compact && isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-crm-accent" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// ── CrmSidebar ───────────────────────────────────────────────────────────────

const CrmSidebar = ({ selectedTab, setSelectedTab, leads, isCollapsed, mobileOpen, setMobileOpen }) => {
  const { t } = useAdminT();

  return (
    <>
      {/* Desktop sidebar — hidden below md */}
      <aside
        className={`hidden md:flex fixed inset-y-0 left-0 flex-col bg-crm-sidebar z-40 transition-[width] duration-300 overflow-hidden`}
        style={{ width: isCollapsed ? '72px' : '240px' }}
      >
        <SidebarInner
          compact={isCollapsed}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          leads={leads}
          t={t}
        />
      </aside>

      {/* Mobile: backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile: slide-in drawer (~78% viewport width) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[78vw] max-w-[300px] bg-crm-sidebar flex flex-col md:hidden transition-transform duration-300 overflow-y-auto`}
        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <SidebarInner
          compact={false}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          leads={leads}
          t={t}
          onClose={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
};

export default CrmSidebar;
