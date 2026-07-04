import { useState, useEffect, useRef } from 'react';
import { useGet } from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  apiGetClients, apiGetLeads, apiGetSubscriptions, apiGetInvoices, apiGetProjects,
  apiGetUsers,
  apiUpdateProjectStage, apiDeleteProject, apiUpdateSubscriptionStatus, apiMarkInvoicePaid,
} from '../api/apiActions';
import { AdminLangProvider, useAdminT } from '../context/AdminLangContext';
import CrmSidebar from '../components/adminPanel/CrmSidebar';
import CrmTopBar  from '../components/adminPanel/CrmTopBar';
import ProjectsTable        from '../components/adminPanel/views/projecttable';
import ClientsTable         from '../components/adminPanel/views/ClientsTable';
import DashboardView        from '../components/adminPanel/views/dashboard/DashboardView';
import PipelineView         from '../components/adminPanel/views/PipelineView';
import SubscriptionsView    from '../components/adminPanel/views/SubscriptionsView';
import InvoicesView         from '../components/adminPanel/views/InvoicesView';
import CreateSubscriptionModal from '../components/adminPanel/modals/CreateSubscriptionModal';
import CreateInvoiceModal      from '../components/adminPanel/modals/CreateInvoiceModal';
import CreateClientModal       from '../components/adminPanel/modals/CreateClientModal';
import CreateLeadModal         from '../components/adminPanel/modals/CreateLeadModal';
import LeadsView  from '../components/adminPanel/views/LeadsView';
import UsersView  from '../components/adminPanel/views/UsersView';
import UserModal  from '../components/adminPanel/modals/UserModal';
import Toast      from '../components/adminPanel/Toast';

const API_URL = import.meta.env.VITE_API_URL;

// ── AdminPanelInner ──────────────────────────────────────────────────────────

const AdminPanelInner = () => {
  const { t } = useAdminT();
  const token    = useSelector((s) => s.auth.token);
  const navigate = useNavigate();

  // ── Sidebar state (persisted) ──────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('crmSidebarCollapsed') === 'true'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('crmSidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // ── Global search ref (passed to topbar for ⌘K focus) ─────────────────────
  const searchRef = useRef(null);

  // ── Active tab ─────────────────────────────────────────────────────────────
  const [selectedTab, setSelectedTab] = useState('dashboard');

  // ── Data ───────────────────────────────────────────────────────────────────
  const [projects,       setProjects]       = useState([]);
  const [clients,        setClients]        = useState([]);
  const [subscriptions,  setSubscriptions]  = useState([]);
  const [invoices,       setInvoices]       = useState([]);
  const [leads,          setLeads]          = useState([]);
  const [users,          setUsers]          = useState([]);

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [showCreateSub,     setShowCreateSub]     = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateClient,  setShowCreateClient]  = useState(false);
  const [showCreateLead,    setShowCreateLead]    = useState(false);
  const [showCreateUser,    setShowCreateUser]    = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  // ── Data fetching ──────────────────────────────────────────────────────────
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

  // ── Refresh helpers ────────────────────────────────────────────────────────
  const refreshClients       = async () => { const d = await apiGetClients(token);       if (Array.isArray(d)) setClients(d);       };
  const refreshSubscriptions = async () => { const d = await apiGetSubscriptions(token); if (Array.isArray(d)) setSubscriptions(d); };
  const refreshInvoices      = async () => { const d = await apiGetInvoices(token);      if (Array.isArray(d)) setInvoices(d);      };
  const refreshLeads         = async () => { const d = await apiGetLeads(token);         if (Array.isArray(d)) setLeads(d);         };
  const refreshProjects      = async () => { const d = await apiGetProjects(token);      if (Array.isArray(d)) setProjects(d);      };
  const refreshUsers         = async () => { const d = await apiGetUsers(token);         if (Array.isArray(d)) setUsers(d);         };

  // ── Handlers ───────────────────────────────────────────────────────────────
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
  const handleLeadStatusChange   = (leadId, newStatus)     => {
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

  // ── Sidebar width offset for the content area ──────────────────────────────
  const contentOffset = sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[240px]';

  // ── Page header — varies by active tab ────────────────────────────────────
  const tabTitle = {
    dashboard:     null, // DashboardView renders its own greeting header
    pipeline:      t.tabs.pipeline,
    projects:      t.tabs.projects,
    clients:       t.tabs.clients,
    subscriptions: t.tabs.subscriptions,
    invoices:      t.tabs.invoices,
    leads:         t.tabs.leads,
    users:         t.tabs.users,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-crm-page">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <CrmSidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        leads={leads}
        isCollapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* ── Main area (shifts right on desktop to clear the sidebar) ──────── */}
      <div className={`flex flex-col flex-1 min-w-0 transition-[padding] duration-300 ${contentOffset}`}>

        {/* Top bar */}
        <CrmTopBar
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          searchRef={searchRef}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

            {/* ── Page header (non-dashboard tabs) ─────────────────────────── */}
            {selectedTab !== 'dashboard' && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-crm-text">
                    {tabTitle[selectedTab]}
                  </h1>

                  {/* Quick-action buttons */}
                  <div className="sm:ml-auto flex flex-wrap gap-2">
                    <button onClick={() => setShowCreateLead(true)}
                      className="flex items-center gap-1.5 bg-white text-gray-700 border border-crm-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      {t.actions.new_lead}
                    </button>
                    <button onClick={() => setShowCreateClient(true)}
                      className="flex items-center gap-1.5 bg-white text-gray-700 border border-crm-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      {t.actions.add_client}
                    </button>
                    <button onClick={() => setShowCreateUser(true)}
                      className="flex items-center gap-1.5 bg-white text-gray-700 border border-crm-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      {t.actions.add_user}
                    </button>
                    <button onClick={() => setShowCreateSub(true)}
                      className="flex items-center gap-1.5 bg-crm-accent text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm">
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
            )}

            {/* ── View content ─────────────────────────────────────────────── */}
            {selectedTab === 'dashboard' && (
              <DashboardView
                leads={leads}
                clients={clients}
                subscriptions={subscriptions}
                invoices={invoices}
                onNewLead={() => setShowCreateLead(true)}
                onNewClient={() => setShowCreateClient(true)}
                onNewSub={() => setShowCreateSub(true)}
                onNewInvoice={() => setShowCreateInvoice(true)}
              />
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
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
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
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
};

// ── AdminPanel (provider wrapper) ────────────────────────────────────────────

const AdminPanel = () => (
  <AdminLangProvider>
    <AdminPanelInner />
  </AdminLangProvider>
);

export default AdminPanel;
