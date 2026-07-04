import { useState, useEffect } from 'react';
import { useGet } from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  apiGetClients, apiGetLeads, apiGetSubscriptions, apiGetInvoices, apiGetProjects,
  apiGetUsers,
  apiUpdateProjectStage, apiDeleteProject, apiUpdateSubscriptionStatus, apiMarkInvoicePaid,
} from '../api/apiActions';
import NavbarAdminPanel from '../components/adminPanel/NavbarAdminPanel';
import { AdminLangProvider, useAdminT } from '../context/AdminLangContext';
import ProjectsTable from '../components/adminPanel/views/projecttable';
import ClientsTable from '../components/adminPanel/views/ClientsTable';
import DashboardView from '../components/adminPanel/views/dashboard/DashboardView';
import PipelineView from '../components/adminPanel/views/PipelineView';
import SubscriptionsView from '../components/adminPanel/views/SubscriptionsView';
import InvoicesView from '../components/adminPanel/views/InvoicesView';
import CreateSubscriptionModal from '../components/adminPanel/modals/CreateSubscriptionModal';
import CreateInvoiceModal from '../components/adminPanel/modals/CreateInvoiceModal';
import CreateClientModal from '../components/adminPanel/modals/CreateClientModal';
import CreateLeadModal from '../components/adminPanel/modals/CreateLeadModal';
import LeadsView from '../components/adminPanel/views/LeadsView';
import UsersView from '../components/adminPanel/views/UsersView';
import UserModal from '../components/adminPanel/modals/UserModal';
import Toast from '../components/adminPanel/Toast';

const API_URL = import.meta.env.VITE_API_URL;

const TAB_KEYS = ['dashboard', 'pipeline', 'projects', 'clients', 'subscriptions', 'invoices', 'leads', 'users'];

const TAB_ICONS = {
  dashboard:     (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  pipeline:      (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  ),
  projects:      (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  clients:       (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  subscriptions: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  invoices:      (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  leads:         (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  users:         (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

// ─── ADMIN PANEL PRINCIPAL ───────────────────────────────────
const AdminPanelInner = () => {
  const { t, lang } = useAdminT();
  const [selectedTab, setSelectedTab]     = useState('dashboard');
  const [projects, setProjects]           = useState([]);
  const [clients, setClients]             = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices]           = useState([]);
  const [leads, setLeads]                 = useState([]);
  const [users, setUsers]                 = useState([]);

  // Modales
  const [showCreateSub,     setShowCreateSub]     = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateClient,  setShowCreateClient]  = useState(false);
  const [showCreateLead,    setShowCreateLead]    = useState(false);
  const [showCreateUser,    setShowCreateUser]    = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  const token    = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const firstName  = authUser?.name?.split(' ')[0] ?? '';
  const userInitials = authUser?.name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t.page.greeting_morning;
    if (h < 20) return t.page.greeting_afternoon;
    return t.page.greeting_evening;
  })();
  const formattedDate = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const { data: rawProjects }      = useGet(`${API_URL}/api/admin/projects/full`, token);
  const { data: rawClients }       = useGet(`${API_URL}/api/clients`,             token);
  const { data: rawSubscriptions } = useGet(`${API_URL}/api/subscriptions`,       token);
  const { data: rawInvoices }      = useGet(`${API_URL}/api/invoices`,            token);
  const { data: rawLeads }         = useGet(`${API_URL}/api/leads`,               token);
  const { data: rawUsers }         = useGet(`${API_URL}/api/users`,               token);

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  useEffect(() => { if (Array.isArray(rawProjects))      setProjects(rawProjects);           }, [rawProjects]);
  useEffect(() => { if (Array.isArray(rawClients))       setClients(rawClients);             }, [rawClients]);
  useEffect(() => { if (Array.isArray(rawSubscriptions)) setSubscriptions(rawSubscriptions); }, [rawSubscriptions]);
  useEffect(() => { if (Array.isArray(rawInvoices))      setInvoices(rawInvoices);           }, [rawInvoices]);
  useEffect(() => { if (Array.isArray(rawLeads))         setLeads(rawLeads);                 }, [rawLeads]);
  useEffect(() => { if (Array.isArray(rawUsers))         setUsers(rawUsers);                 }, [rawUsers]);

  // ── Refresh ──────────────────────────────────────────────
  const refreshClients       = async () => { const d = await apiGetClients(token);       if (Array.isArray(d)) setClients(d); };
  const refreshSubscriptions = async () => { const d = await apiGetSubscriptions(token); if (Array.isArray(d)) setSubscriptions(d); };
  const refreshInvoices      = async () => { const d = await apiGetInvoices(token);      if (Array.isArray(d)) setInvoices(d); };
  const refreshLeads         = async () => { const d = await apiGetLeads(token);         if (Array.isArray(d)) setLeads(d); };
  const refreshProjects      = async () => { const d = await apiGetProjects(token);      if (Array.isArray(d)) setProjects(d); };
  const refreshUsers         = async () => { const d = await apiGetUsers(token);         if (Array.isArray(d)) setUsers(d); };

  // ── Handlers ─────────────────────────────────────────────
  const handleStageChange = async (projectId, stage) => {
    await apiUpdateProjectStage(token, projectId, stage);
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, stage } : p));
  };

  const handleSubscriptionStatus = async (id, status) => {
    await apiUpdateSubscriptionStatus(token, id, status);
    setSubscriptions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  };

  const handleMarkPaid = async (id) => {
    await apiMarkInvoicePaid(token, id);
    setInvoices((prev) => prev.map((i) => i.id === id ? { ...i, status: 'paid' } : i));
    showToast(t.toasts.invoice_paid);
  };

  const handleClientDelete = () => { refreshClients(); showToast(t.toasts.client_deleted); };

  const handleProjectDelete = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.project?.id !== projectId));
    showToast(t.toasts.project_deleted);
  };

  const handleClientStatusChange = (clientId, newStatus) => {
    setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, status: newStatus } : c));
    showToast(t.toasts.client_status_updated);
  };

  const handleLeadStatusChange = (leadId, newStatus) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l));
    showToast(t.toasts.lead_status_updated);
  };

  const handleLeadConvert = (leadId, result) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: 'converted' } : l));
    const msg = result?.project
      ? t.toasts.lead_converted
      : (t.toasts.lead_converted_existing ?? 'Lead convertido · cliente ya tenía suscripción activa');
    showToast(msg);
    refreshClients();
    refreshLeads();
  };

  const handleLeadUpdate = (leadId, patch) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, ...patch } : l));
  };

  const handleLeadDelete = (leadId) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    showToast(t.toasts.lead_deleted);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      <NavbarAdminPanel onNavigate={setSelectedTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">

        {/* ── Page header ── */}
        <div className="pt-6 pb-5 border-b border-gray-200 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">

            {/* Greeting + avatar */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm select-none">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
                  {greeting}
                </p>
                <h1 className="text-2xl sm:text-2xl font-bold text-navy leading-tight truncate">
                  {firstName}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{formattedDate}</p>
              </div>
            </div>

            {/* Action buttons — right */}
            <div className="flex flex-wrap gap-2 sm:justify-end items-center">
              <div className="flex gap-1.5">
                <button onClick={() => setShowCreateLead(true)}
                  className="flex items-center gap-1.5 bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  {t.actions.new_lead}
                </button>
                <button onClick={() => setShowCreateClient(true)}
                  className="flex items-center gap-1.5 bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {t.actions.add_client}
                </button>
                <button onClick={() => setShowCreateUser(true)}
                  className="flex items-center gap-1.5 bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {t.actions.add_user}
                </button>
              </div>
              <div className="w-px h-5 bg-gray-200 hidden sm:block" />
              <div className="flex gap-1.5">
                <button onClick={() => setShowCreateSub(true)}
                  className="flex items-center gap-1.5 bg-cyan text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-cyan-medium transition shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  {t.actions.subscription}
                </button>
                <button onClick={() => setShowCreateInvoice(true)}
                  className="flex items-center gap-1.5 bg-navy text-white px-3 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition shadow-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {t.actions.invoice}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick stats strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            {
              label: t.stats.new_leads,
              value: leads.filter(l => l.status === 'new').length,
              accent: 'bg-blue-50 text-blue-500',
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
            },
            {
              label: t.stats.active_clients,
              value: clients.filter(c => c.status === 'active').length,
              accent: 'bg-emerald-50 text-emerald-500',
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
            {
              label: t.stats.active_subs,
              value: subscriptions.filter(s => s.status === 'active').length,
              accent: 'bg-cyan/10 text-cyan',
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ),
            },
            {
              label: t.stats.pending_invoices,
              value: invoices.filter(i => i.status === 'pending').length,
              accent: 'bg-amber-50 text-amber-500',
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            },
          ].map(({ label, value, accent, icon }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex items-center gap-3 hover:border-gray-300 transition">
              <div className={`w-9 h-9 rounded-lg ${accent} flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── underline style */}
        <div className="border-b border-gray-200 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-0 overflow-x-auto -mb-px" style={{ scrollbarWidth: 'none' }}>
            {TAB_KEYS.map((key) => {
              const isActive = selectedTab === key;
              const newLeadsBadge = key === 'leads' && leads.filter(l => l.status === 'new').length > 0;
              return (
                <button key={key} onClick={() => setSelectedTab(key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all flex-shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'border-navy text-navy'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                  }`}>
                  <span className={isActive ? 'opacity-100' : 'opacity-40'}>{TAB_ICONS[key]}</span>
                  <span>{t.tabs[key]}</span>
                  {newLeadsBadge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold leading-none ${
                      isActive ? 'bg-navy/10 text-navy' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {leads.filter(l => l.status === 'new').length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── View content ── */}
        <div>
          {selectedTab === 'dashboard' && (
            <DashboardView leads={leads} clients={clients} subscriptions={subscriptions} invoices={invoices} />
          )}
          {selectedTab === 'pipeline' && (
            <PipelineView
              projects={projects}
              onStageChange={handleStageChange}
              token={token}
              onDeleteProject={handleProjectDelete}
            />
          )}
          {selectedTab === 'projects' && (
            <ProjectsTable
              projects={projects.map((p) => ({
                project: p.project,
                client: p.client,
                requirements: p.requirements,
              }))}
              token={token}
              onDeleteProject={handleProjectDelete}
            />
          )}
          {selectedTab === 'clients' && (
            <ClientsTable
              clients={clients}
              token={token}
              onDelete={handleClientDelete}
              onStatusChange={handleClientStatusChange}
              onRefresh={refreshClients}
            />
          )}
          {selectedTab === 'subscriptions' && (
            <SubscriptionsView subscriptions={subscriptions} onStatusChange={handleSubscriptionStatus} />
          )}
          {selectedTab === 'invoices' && (
            <InvoicesView invoices={invoices} onMarkPaid={handleMarkPaid} />
          )}
          {selectedTab === 'leads' && (
            <LeadsView
              leads={leads}
              token={token}
              users={users}
              onRefresh={refreshLeads}
              onStatusChange={handleLeadStatusChange}
              onConvert={handleLeadConvert}
              onDelete={handleLeadDelete}
              onLeadUpdate={handleLeadUpdate}
            />
          )}
          {selectedTab === 'users' && (
            <UsersView
              users={users}
              token={token}
              onRefresh={refreshUsers}
            />
          )}
        </div>
      </div>

      {/* ── Modales ── */}
      <CreateSubscriptionModal
        isOpen={showCreateSub}
        onClose={() => setShowCreateSub(false)}
        clients={clients}
        token={token}
        onSuccess={() => { refreshSubscriptions(); setShowCreateSub(false); showToast(t.toasts.subscription_created); }}
      />
      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
        clients={clients}
        subscriptions={subscriptions}
        token={token}
        invoices={invoices}
        onSuccess={() => { refreshInvoices(); setShowCreateInvoice(false); showToast(t.toasts.invoice_created); }}
      />
      <CreateClientModal
        isOpen={showCreateClient}
        onClose={() => setShowCreateClient(false)}
        token={token}
        onSuccess={() => { refreshClients(); showToast(t.toasts.client_created); }}
      />
      <CreateLeadModal
        isOpen={showCreateLead}
        onClose={() => setShowCreateLead(false)}
        onSuccess={() => { refreshLeads(); showToast(t.toasts.lead_created); }}
      />
      <UserModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        token={token}
        onSuccess={() => { refreshUsers(); setShowCreateUser(false); showToast(t.toasts.user_created); }}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
};

const AdminPanel = () => (
  <AdminLangProvider>
    <AdminPanelInner />
  </AdminLangProvider>
);

export default AdminPanel;
