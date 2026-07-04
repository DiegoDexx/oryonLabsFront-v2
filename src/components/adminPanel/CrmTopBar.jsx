import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';
import { apiLogout } from '../../api/apiActions';
import { useAdminT } from '../../context/AdminLangContext';

// ── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (user) => {
  if (!user) return '?';
  if (user.name) {
    return user.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return (user.email?.[0] || '?').toUpperCase();
};

// ── CrmTopBar ─────────────────────────────────────────────────────────────────

const CrmTopBar = ({ isCollapsed, setIsCollapsed, mobileMenuOpen, setMobileMenuOpen, searchRef }) => {
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const token          = useSelector((s) => s.auth.token);
  const user           = useSelector((s) => s.auth.user);
  const { t, lang, setLang } = useAdminT();

  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [logoutLoading,  setLogoutLoading]  = useState(false);
  const dropdownRef = useRef(null);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ⌘K / Ctrl+K → focus search input
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef?.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchRef]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try { await apiLogout(token); } catch { /* ignore — session is cleaned locally */ }
    finally {
      navigate('/login');
      dispatch(logoutUser());
    }
  };

  const handleToggle = () => {
    // On mobile: open drawer; on desktop: collapse/expand rail
    if (window.innerWidth < 768) {
      setMobileMenuOpen((o) => !o);
    } else {
      setIsCollapsed((c) => !c);
    }
  };

  const initials = getInitials(user);
  const placeholder = t.navbar?.search_placeholder || 'Buscar clientes, leads, facturas...';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0 z-30 sticky top-0">

      {/* Hamburger / collapse toggle */}
      <button
        onClick={handleToggle}
        className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search input */}
      <div className="flex-1 min-w-0 max-w-lg">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            placeholder={placeholder}
            className="w-full bg-[#F1F5F9] rounded-lg pl-9 pr-14 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crm-accent/30 transition-shadow"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 font-mono leading-none pointer-events-none hidden sm:inline">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Notification bell — static (no backend yet) */}
      <button
        className="flex-shrink-0 p-2 rounded-lg text-[#64748B] hover:bg-gray-100 transition-colors"
        aria-label="Notificaciones"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      {/* Avatar + dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="w-9 h-9 rounded-full bg-crm-accent text-white font-bold text-sm flex items-center justify-center hover:opacity-90 transition-opacity select-none"
          aria-label="User menu"
          aria-expanded={dropdownOpen}
        >
          {initials}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">

            {/* User info */}
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || user?.email || '—'}</p>
              {user?.name && user?.email && (
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
              )}
            </div>

            {/* Language picker */}
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-2">{t.navbar?.language || 'Idioma'}</p>
              <div className="flex gap-1.5">
                {['es', 'en'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 py-1 text-xs rounded-md font-semibold transition-all ${
                      lang === l
                        ? 'bg-navy text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {l === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
                  </button>
                ))}
              </div>
            </div>

            {/* Log out */}
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
            >
              {logoutLoading ? (
                <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
              )}
              {t.navbar?.logout || 'Cerrar sesión'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CrmTopBar;
