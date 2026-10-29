/**
 * Capa centralizada de peticiones a la API de OryonX.
 *
 * Todas las llamadas incluyen siempre `Accept: application/json`.
 * Sin ese header, Laravel no detecta el request como API y redirige
 * con 302 en lugar de devolver 422 JSON cuando falla la validación.
 */

const API_URL = import.meta.env.VITE_API_URL;

const request = async (method, path, body = null, token = null) => {
  const headers = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(body !== null ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data.message ||
      (data.errors ? Object.values(data.errors).flat().join(" ") : null) ||
      `Error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return data;
};

/**
 * Variante de `request` para respuestas binarias (PDFs). Devuelve un
 * objectURL listo para <iframe>/<a download>. En error intenta parsear el
 * cuerpo como JSON para reutilizar el mismo contrato de errores.
 */
const requestBlob = async (path, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/pdf",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || `Error ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const apiLogout = (token) =>
  request("POST", "/api/logout", null, token);

// ── Clients ──────────────────────────────────────────────────────────────────
export const apiGetClients = (token) =>
  request("GET", "/api/clients", null, token);

export const apiCreateClient = (token, data) =>
  request("POST", "/api/clients", data, token);

export const apiUpdateClient = (token, id, data) =>
  request("PATCH", `/api/clients/${id}`, data, token);

export const apiDeleteClient = (token, id) =>
  request("DELETE", `/api/clients/${id}`, null, token);

// ── Leads ─────────────────────────────────────────────────────────────────────
export const apiGetLeads = (token) =>
  request("GET", "/api/leads", null, token);

/** Crear lead desde el admin panel — ruta protegida (Sanctum o X-Service-Token) */
export const apiSubmitLeadForm = (token, data) =>
  request("POST", "/api/leads", data, token);

export const apiUpdateLead = (token, id, data) =>
  request("PATCH", `/api/leads/${id}`, data, token);

export const apiUpdateLeadStatus = (token, id, status) =>
  request("PATCH", `/api/leads/${id}/status`, { status }, token);

export const apiUpdateLeadNotes = (token, id, notes) =>
  request("PATCH", `/api/leads/${id}/notes`, { notes }, token);

export const apiConvertLead = (token, id) =>
  request("POST", `/api/leads/${id}/convert`, null, token);

export const apiDeleteLead = (token, id) =>
  request("DELETE", `/api/leads/${id}`, null, token);

// ── Projects ──────────────────────────────────────────────────────────────────
// GET /api/projects → indexFull: [{ client, project, requirements }] (auth:sanctum, tenant-scoped).
export const apiGetProjects = (token) =>
  request("GET", "/api/projects", null, token);

export const apiUpdateProject = (token, id, data) =>
  request("PATCH", `/api/projects/${id}`, data, token);

export const apiUpdateProjectStage = (token, id, stage) =>
  request("PATCH", `/api/projects/${id}/stage`, { stage }, token);

export const apiDeleteProject = (token, id) =>
  request("DELETE", `/api/projects/${id}`, null, token);

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const apiGetSubscriptions = (token) =>
  request("GET", "/api/subscriptions", null, token);

export const apiCreateSubscription = (token, data) =>
  request("POST", "/api/subscriptions", data, token);

export const apiUpdateSubscriptionStatus = (token, id, status) =>
  request("PATCH", `/api/subscriptions/${id}/status`, { status }, token);

export const apiDeleteSubscription = (token, id) =>
  request("DELETE", `/api/subscriptions/${id}`, null, token);

// ── Invoices ──────────────────────────────────────────────────────────────────
// El panel opera sobre client_invoices: documento fiscal real con PDF dompdf
// + envío SES + estados draft/sent/paid/overdue. La tabla /api/invoices
// (facturación interna SaaS de OryonX a tenants) no se usa en la vista.
export const apiGetInvoices = (token) =>
  request("GET", "/api/client-invoices", null, token);

export const apiCreateInvoice = (token, data) =>
  request("POST", "/api/client-invoices", data, token);

export const apiMarkInvoicePaid = (token, id) =>
  request("PATCH", `/api/client-invoices/${id}/mark-paid`, null, token);
export const apiSendInvoice = (token, id) =>
  request("POST", `/api/client-invoices/${id}/send`, null, token);

export const apiGetInvoicePdfUrl = (token, id) =>
  requestBlob(`/api/client-invoices/${id}/pdf`, token);

// ── Quotes ────────────────────────────────────────────────────────────────────
export const apiGetQuotes = (token) =>
  request("GET", "/api/quotes", null, token);

export const apiCreateQuote = (token, data) =>
  request("POST", "/api/quotes", data, token);

export const apiSendQuote = (token, id) =>
  request("POST", `/api/quotes/${id}/send`, null, token);

export const apiGetQuotePdfUrl = (token, id) =>
  requestBlob(`/api/quotes/${id}/pdf`, token);

// ── WhatsApp (vía n8n — el backend Laravel no interviene) ────────────────────
const N8N_WHATSAPP_WEBHOOK = import.meta.env.VITE_N8N_WHATSAPP_WEBHOOK;

export const apiSendWhatsAppDocument = async ({ doc_type, doc_id, phone, name }) => {
  if (!N8N_WHATSAPP_WEBHOOK) {
    throw new Error("WhatsApp sending is not configured (missing VITE_N8N_WHATSAPP_WEBHOOK)");
  }
  const res = await fetch(N8N_WHATSAPP_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ doc_type, doc_id, phone, name }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || `WhatsApp send failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return res.json().catch(() => ({}));
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const apiGetUsers = (token) =>
  request("GET", "/api/users", null, token);

export const apiCreateUser = (token, data) =>
  request("POST", "/api/users", data, token);

export const apiUpdateUser = (token, id, data) =>
  request("PATCH", `/api/users/${id}`, data, token);

export const apiDeleteUser = (token, id) =>
  request("DELETE", `/api/users/${id}`, null, token);

// ── Global search ─────────────────────────────────────────────────────────────
export const apiGlobalSearch = (token, type, value) =>
  request("GET", `/api/search?type=${encodeURIComponent(type)}&value=${encodeURIComponent(value)}`, null, token);

// ── Platform admin (OryonX only — cross-tenant) ─────────────────────────────
const qs = (params) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

export const apiGetOrganizations = (token) =>
  request("GET", "/api/organizations", null, token);

export const apiGetUsageMetrics = (token, orgId, params = {}) =>
  request("GET", `/api/metrics/usage?${qs({ organization_id: orgId, ...params })}`, null, token);

export const apiGetCallMetrics = (token, orgId, params = {}) =>
  request("GET", `/api/metrics/calls?${qs({ organization_id: orgId, ...params })}`, null, token);

export const apiGetExecutionMetrics = (token, orgId, params = {}) =>
  request("GET", `/api/metrics/executions?${qs({ organization_id: orgId, ...params })}`, null, token);

export const apiGetMarginMetrics = (token, orgId, params = {}) =>
  request("GET", `/api/metrics/margin?${qs({ organization_id: orgId, ...params })}`, null, token);

// ── Refresh helpers ───────────────────────────────────────────────────────────
/** Fetches all panel data in parallel. Returns { clients, leads, subscriptions, invoices, projects }. */
export const apiRefreshAll = async (token) => {
  const [clients, leads, subscriptions, invoices, projects] = await Promise.all([
    apiGetClients(token),
    apiGetLeads(token),
    apiGetSubscriptions(token),
    apiGetInvoices(token),
    apiGetProjects(token),
  ]);
  return { clients, leads, subscriptions, invoices, projects };
};
