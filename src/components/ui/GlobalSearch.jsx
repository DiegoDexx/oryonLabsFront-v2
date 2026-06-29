import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { apiGlobalSearch } from "../../api/apiActions";
import { useAdminT } from "../../context/AdminLangContext";
import Modal from "./Modal";

function detectSearchType(value) {
  const trimmed = value.trim();
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmed)) return "email";
  if (/^[\d\s+\-()]{6,}$/.test(trimmed)) return "phone";
  return "name";
}

const RESULT_COLOR = {
  clients:       "text-emerald-600 bg-emerald-50",
  leads:         "text-blue-600 bg-blue-50",
  invoices:      "text-amber-600 bg-amber-50",
  subscriptions: "text-cyan bg-cyan/10",
};

const RESULT_TAB = {
  clients:       "clients",
  leads:         "leads",
  invoices:      "invoices",
  subscriptions: "subscriptions",
};

/* ── Icons ── */
const SearchIcon = ({ cls = "w-4 h-4" }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ── Helpers ── */
function getResultLabel(item, section) {
  if (section === "invoices")      return item.invoice_number || "—";
  if (section === "subscriptions") return item.plan || "—";
  return item.name || "—";
}

function getResultSub(item, section) {
  if (section === "clients")       return item.email || item.phone;
  if (section === "leads")         return item.email || item.phone;
  if (section === "invoices")      return item.amount ? `€${item.amount}` : item.status;
  if (section === "subscriptions") return item.monthly_fee ? `€${item.monthly_fee}/mes` : item.status;
  return null;
}

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm text-gray-800">{value || "—"}</p>
  </div>
);

/* ── Main component ── */
const GlobalSearch = ({ onNavigate }) => {
  const { t }  = useAdminT();
  const ts     = t.search;
  const token  = useSelector((s) => s.auth.token);

  const [query,          setQuery]          = useState("");
  const [results,        setResults]        = useState(null);
  const [searching,      setSearching]      = useState(false);
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [detailTarget,   setDetailTarget]   = useState(null);

  const wrapperRef  = useRef(null);
  const mobileInput = useRef(null);
  const desktopInput = useRef(null);
  const debounceRef = useRef(null);

  /* click-outside closes desktop dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Escape closes everything */
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "Escape") return;
      setDropdownOpen(false);
      setMobileExpanded(false);
      setQuery("");
      setResults(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* Auto-focus when mobile expands */
  useEffect(() => {
    if (mobileExpanded) setTimeout(() => mobileInput.current?.focus(), 60);
  }, [mobileExpanded]);

  const runSearch = useCallback(async (value) => {
    if (!value.trim() || value.trim().length < 2) {
      setResults(null);
      setDropdownOpen(false);
      return;
    }
    setSearching(true);
    try {
      const type = detectSearchType(value);
      const data = await apiGlobalSearch(token, type, value.trim());
      setResults(data);
      setDropdownOpen(true);
    } catch (err) {
      console.error("GlobalSearch error:", err.message);
    } finally {
      setSearching(false);
    }
  }, [token]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 300);
  };

  const collapse = () => {
    setMobileExpanded(false);
    setDropdownOpen(false);
    setQuery("");
    setResults(null);
  };

  const handleResultClick = (section) => {
    collapse();
    onNavigate?.(RESULT_TAB[section]);
  };

  const handleEyeClick = (e, section, item) => {
    e.stopPropagation();
    setDetailTarget({ section, item });
  };

  const hasResults = results && Object.values(results).some((arr) => arr?.length > 0);

  /* ── Result list (shared between mobile/desktop) ── */
  const ResultList = ({ mobile = false }) => {
    const px = mobile ? "px-4" : "px-3";
    if (!hasResults) {
      return (
        <p className={`text-sm text-gray-400 text-center py-6 ${px}`}>
          {ts.no_results} <span className="font-medium text-gray-700">"{query}"</span>
        </p>
      );
    }
    return (
      <div className={`${mobile ? "max-h-[60vh]" : "max-h-72"} overflow-y-auto divide-y divide-gray-50`}>
        {Object.entries(results).map(([section, items]) => {
          if (!items?.length) return null;
          const label    = ts.sections[section] || section;
          const colorCls = RESULT_COLOR[section] || "text-gray-600 bg-gray-100";
          return (
            <div key={section} className="py-1.5">
              <p className={`${px} pt-1.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider`}>
                {label}
              </p>
              {items.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${px} ${mobile ? "py-2.5" : "py-2"} hover:bg-gray-50 cursor-pointer transition`}
                  onClick={() => handleResultClick(section)}
                >
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${colorCls}`}>
                    {label.slice(0, 3).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{getResultLabel(item, section)}</p>
                    {getResultSub(item, section) && (
                      <p className="text-xs text-gray-400 truncate">{getResultSub(item, section)}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleEyeClick(e, section, item)}
                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-md transition flex-shrink-0"
                  >
                    <EyeIcon />
                  </button>
                </div>
              ))}
              {items.length > 5 && (
                <button
                  className={`${px} pb-1.5 text-xs text-cyan hover:underline`}
                  onClick={() => handleResultClick(section)}
                >
                  {ts.see_all.replace("{n}", items.length)} {label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* ── Detail modal ── */
  const DetailModal = () => {
    if (!detailTarget) return null;
    const { section, item } = detailTarget;
    const rd = ts.result_detail;

    let fields;
    if (section === "clients") {
      fields = (
        <>
          <DetailRow label={rd.client}  value={item.name} />
          <DetailRow label="Email"      value={item.email} />
          <DetailRow label="Phone"      value={item.phone} />
          <DetailRow label={rd.status}  value={item.status} />
        </>
      );
    } else if (section === "leads") {
      fields = (
        <>
          <DetailRow label={rd.lead}    value={item.name} />
          <DetailRow label="Email"      value={item.email} />
          <DetailRow label="Phone"      value={item.phone} />
          <DetailRow label={rd.status}  value={item.status} />
          <DetailRow label="Channel"    value={item.channel} />
          <DetailRow label="Challenge"  value={item.challenge} />
        </>
      );
    } else if (section === "invoices") {
      fields = (
        <>
          <DetailRow label={rd.invoice}   value={item.invoice_number} />
          <DetailRow label={rd.amount}    value={item.amount ? `€${item.amount}` : null} />
          <DetailRow label={rd.status}    value={item.status} />
          <DetailRow label={rd.due_date}  value={item.due_date} />
          <DetailRow label={rd.client}    value={item.client?.name} />
        </>
      );
    } else {
      fields = (
        <>
          <DetailRow label={rd.plan}        value={item.plan} />
          <DetailRow label={rd.monthly_fee} value={item.monthly_fee ? `€${item.monthly_fee}/mes` : null} />
          <DetailRow label={rd.status}      value={item.status} />
          <DetailRow label={t.subscriptions?.detail?.start || "Start"} value={item.start_date} />
          <DetailRow label={rd.client}      value={item.client?.name} />
        </>
      );
    }

    const sectionSingular = section.replace(/s$/, "");
    const modalTitle = rd[sectionSingular] || section;

    return (
      <Modal isOpen onClose={() => setDetailTarget(null)} title={modalTitle}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">{fields}</div>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => { setDetailTarget(null); handleResultClick(section); }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-cyan text-white text-sm font-semibold hover:bg-opacity-90 transition"
            >
              {rd.navigate}
            </button>
            <button
              onClick={() => setDetailTarget(null)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              {rd.close}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {/* ── Mobile: icon button (visible only on <sm) ── */}
      <button
        className="sm:hidden p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-lg transition"
        onClick={() => setMobileExpanded(true)}
        aria-label="Search"
      >
        <SearchIcon cls="w-5 h-5" />
      </button>

      {/* ── Mobile expanded overlay ── */}
      {mobileExpanded && (
        <div className="sm:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/20" onClick={collapse} />
          {/* Search bar pinned to top */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  {searching ? <Spinner /> : <SearchIcon />}
                </span>
                <input
                  ref={mobileInput}
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder={ts.placeholder}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 transition placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={collapse}
                className="p-2 text-gray-400 hover:text-gray-700 flex-shrink-0 rounded-lg hover:bg-gray-100 transition"
              >
                <CloseIcon />
              </button>
            </div>
            {dropdownOpen && query.trim().length >= 2 && (
              <div className="border-t border-gray-100 bg-white">
                <ResultList mobile />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Desktop search (hidden on <sm) ── */}
      <div ref={wrapperRef} className="hidden sm:block relative flex-1 max-w-md">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {searching ? <Spinner /> : <SearchIcon />}
          </span>
          <input
            ref={desktopInput}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => { if (hasResults) setDropdownOpen(true); }}
            placeholder={ts.placeholder}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 transition placeholder:text-gray-400"
          />
        </div>
        {dropdownOpen && query.trim().length >= 2 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
            <ResultList />
          </div>
        )}
      </div>

      <DetailModal />
    </>
  );
};

export default GlobalSearch;
