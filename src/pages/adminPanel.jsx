import { useState, useEffect } from 'react';
import { useGet } from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  apiGetClients, apiGetLeads, apiGetSubscriptions, apiGetInvoices, apiGetProjects,
  apiUpdateProjectStage, apiUpdateSubscriptionStatus, apiMarkInvoicePaid,
} from '../api/apiActions';
import NavbarAdminPanel from '../components/adminPanel/NavbarAdminPanel';
import { AdminLangProvider, useAdminT } from '../context/AdminLangContext';
import ProjectsTable from '../components/adminPanel/views/projecttable';
import ClientsTable from '../components/adminPanel/views/ClientsTable';
import DashboardView from '../components/adminPanel/views/DashboardView';
import PipelineView from '../components/adminPanel/views/PipelineView';
import SubscriptionsView from '../components/adminPanel/views/SubscriptionsView';
import InvoicesView from '../components/adminPanel/views/InvoicesView';
import CreateSubscriptionModal from '../components/adminPanel/CreateSubscriptionModal';
import CreateInvoiceModal from '../components/adminPanel/CreateInvoiceModal';
import CreateClientModal from '../components/adminPanel/CreateClientModal';
import CreateLeadModal from '../components/adminPanel/CreateLeadModal';
import LeadsView from '../components/adminPanel/views/LeadsView';
import Toast from '../components/adminPanel/Toast';

const API_URL = import.meta.env.VITE_API_URL;

const TAB_KEYS = ['dashboard', 'pipeline', 'projects', 'clients', 'subscriptions', 'invoices', 'leads'];

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
};

// ─── ADMIN PANEL PRINCIPAL ───────────────────────────────────
const AdminPanelInner = () => {
  const { t } = useAdminT();
  const [selectedTab, setSelectedTab]     = useState('dashboard');
  const [projects, setProjects]           = useState([]);
  const [clients, setClients]             = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices]           = useState([]);
  const [leads, setLeads]                 = useState([]);

  // Modales
  const [showCreateSub,     setShowCreateSub]     = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateClient,  setShowCreateClient]  = useState(false);
  const [showCreateLead,    setShowCreateLead]    = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  const token    = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const { data: rawProjects }      = useGet(`${API_URL}/api/admin/projects/full`, token);
  const { data: rawClients }       = useGet(`${API_URL}/api/clients`,             token);
  const { data: rawSubscriptions } = useGet(`${API_URL}/api/subscriptions`,       token);
  const { data: rawInvoices }      = useGet(`${API_URL}/api/invoices`,            token);
  const { data: rawLeads }         = useGet(`${API_URL}/api/leads`,               token);

  useEffect(() => { if (!token) navigate('/login'); }, [token, navigate]);

  useEffect(() => { if (Array.isArray(rawProjects))      setProjects(rawProjects);           }, [rawProjects]);
  useEffect(() => { if (Array.isArray(rawClients))       setClients(rawClients);             }, [rawClients]);
  useEffect(() => { if (Array.isArray(rawSubscriptions)) setSubscriptions(rawSubscriptions); }, [rawSubscriptions]);
  useEffect(() => { if (Array.isArray(rawInvoices))      setInvoices(rawInvoices);           }, [rawInvoices]);
  useEffect(() => { if (Array.isArray(rawLeads))         setLeads(rawLeads);                 }, [rawLeads]);

  // ── Refresh ──────────────────────────────────────────────
  const refreshClients       = async () => { const d = await apiGetClients(token);       if (Array.isArray(d)) setClients(d); };
  const refreshSubscriptions = async () => { const d = await apiGetSubscriptions(token); if (Array.isArray(d)) setSubscriptions(d); };
  const refreshInvoices      = async () => { const d = await apiGetInvoices(token);      if (Array.isArray(d)) setInvoices(d); };
  const refreshLeads         = async () => { const d = await apiGetLeads(token);         if (Array.isArray(d)) setLeads(d); };
  const refreshProjects      = async () => { const d = await apiGetProjects(token);      if (Array.isArray(d)) setProjects(d); };

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

  const handleClientStatusChange = (clientId, newStatus) => {
    setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, status: newStatus } : c));
    showToast(t.toasts.client_status_updated);
  };

  const handleLeadStatusChange = (leadId, newStatus) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l));
    showToast(t.toasts.lead_status_updated);
  };

  const handleLeadConvert = (leadId) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: 'converted' } : l));
    showToast(t.toasts.lead_converted);
    refreshClients();
    refreshLeads();
  };

  const handleLeadDelete = (leadId) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    showToast(t.toasts.lead_deleted);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <NavbarAdminPanel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">

        {/* ── Page header ── */}
        <div className="py-6 border-b border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                {t.page.title}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{t.page.subtitle}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button onClick={() => setShowCreateLead(true)}
                className="flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {t.actions.new_lead}
              </button>
              <button onClick={() => setShowCreateClient(true)}
                className="flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {t.actions.add_client}
              </button>
              <button onClick={() => setShowCreateSub(true)}
                className="flex items-center gap-1.5 bg-cyan text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-cyan-medium transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {t.actions.subscription}
              </button>
              <button onClick={() => setShowCreateInvoice(true)}
                className="flex items-center gap-1.5 bg-navy text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {t.actions.invoice}
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ── horizontally scrollable on mobile */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none' }}>
          {TAB_KEYS.map((key) => {
            const isActive = selectedTab === key;
            return (
              <button key={key} onClick={() => setSelectedTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex-shrink-0 ${
                  isActive ? 'bg-navy text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}>
                <span className={isActive ? 'opacity-100' : 'opacity-50'}>{TAB_ICONS[key]}</span>
                <span>{t.tabs[key]}</span>
                {key === 'leads' && leads.filter(l => l.status === 'new').length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold leading-none ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {leads.filter(l => l.status === 'new').length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── View content ── */}
        <div>
          {selectedTab === 'dashboard' && (
            <DashboardView leads={leads} clients={clients} subscriptions={subscriptions} invoices={invoices} />
          )}
          {selectedTab === 'pipeline' && (
            <PipelineView projects={projects} onStageChange={handleStageChange} />
          )}
          {selectedTab === 'projects' && (
            <ProjectsTable projects={projects.map((p) => ({
              project: p, client: p.client, requirements: p.requirements,
            }))} />
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
              onRefresh={refreshLeads}
              onStatusChange={handleLeadStatusChange}
              onConvert={handleLeadConvert}
              onDelete={handleLeadDelete}
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
