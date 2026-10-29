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

const qs = (params) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

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
export const apiGetInvoices = (token) =>
  request("GET", "/api/invoices", null, token);

export const apiCreateInvoice = (token, data) =>
  request("POST", "/api/invoices", data, token);

export const apiMarkInvoicePaid = (token, id) =>
  request("PATCH", `/api/invoices/${id}/mark-paid`, null, token);

// ── Client invoices (PSR → sus clientes; distinto de /api/invoices) ───────────
export const apiGetClientInvoices = (token, params = {}) => {
  const query = qs(params);
  return request("GET", `/api/client-invoices${query ? `?${query}` : ""}`, null, token);
};

export const apiCreateClientInvoice = (token, data) =>
  request("POST", "/api/client-invoices", data, token);

export const apiUpdateClientInvoice = (token, id, data) =>
  request("PATCH", `/api/client-invoices/${id}`, data, token);

export const apiDeleteClientInvoice = (token, id) =>
  request("DELETE", `/api/client-invoices/${id}`, null, token);

export const apiMarkClientInvoicePaid = (token, id, paymentMethod = null) =>
  request("PATCH", `/api/client-invoices/${id}/mark-paid`, paymentMethod ? { payment_method: paymentMethod } : null, token);

export const apiSendClientInvoice = (token, id) =>
  request("POST", `/api/client-invoices/${id}/send`, null, token);

/**
 * El endpoint del PDF exige Bearer, así que un <a href> directo daría 401:
 * se descarga con fetch, se convierte en blob y se dispara la descarga.
 */
export const apiDownloadClientInvoicePdf = async (token, id, invoiceNumber) => {
  const res = await fetch(`${API_URL}/api/client-invoices/${id}/pdf`, {
    headers: { Accept: "application/pdf", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || `Error ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  const url  = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber || `invoice-${id}`}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * PDF como objectURL (sin descargar) — para el visor <iframe> del panel.
 * Mismo contrato de errores que request(): err.status / err.data.
 */
export const apiGetPdfBlobUrl = async (token, path) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/pdf", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || `Error ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return URL.createObjectURL(await res.blob());
};

/**
 * Envío por WhatsApp vía workflow n8n (CERO cambios de backend): n8n recibe
 * { doc_type, doc_id, phone, name }, descarga el PDF con token de servicio y
 * lo envía por la Cloud API de Meta. Sin VITE_N8N_WHATSAPP_WEBHOOK configurada
 * lanza error controlado que el visor muestra como "not configured".
 */
export const apiSendWhatsAppDocument = async ({ doc_type, doc_id, phone, name }) => {
  const url = import.meta.env.VITE_N8N_WHATSAPP_WEBHOOK;
  if (!url) {
    const err = new Error("WhatsApp sending is not configured");
    err.status = 0;
    throw err;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ doc_type, doc_id, phone, name }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || data.error || `Error ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return res.json().catch(() => ({ ok: true }));
};

// ── Trade jobs ────────────────────────────────────────────────────────────────
export const apiGetTradeJobs = (token) =>
  request("GET", "/api/trade-jobs", null, token);

// ── Quotes (presupuestos PSR → leads) ────────────────────────────────────────
export const apiGetQuotes = (token) =>
  request("GET", "/api/quotes", null, token);

export const apiCreateQuote = (token, data) =>
  request("POST", "/api/quotes", data, token);

export const apiUpdateQuote = (token, id, data) =>
  request("PATCH", `/api/quotes/${id}`, data, token);

export const apiDeleteQuote = (token, id) =>
  request("DELETE", `/api/quotes/${id}`, null, token);

export const apiUpdateQuoteStatus = (token, id, status) =>
  request("PATCH", `/api/quotes/${id}/status`, { status }, token);

export const apiSendQuote = (token, id) =>
  request("POST", `/api/quotes/${id}/send`, null, token);

export const apiDownloadQuotePdf = async (token, id, quoteNumber) => {
  const res = await fetch(`${API_URL}/api/quotes/${id}/pdf`, {
    headers: { Accept: "application/pdf", Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.message || `Error ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  const url  = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quoteNumber || `quote-${id}`}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ── Billing profile (datos fiscales de la organización autenticada) ──────────
export const apiGetBillingProfile = (token) =>
  request("GET", "/api/me/billing-profile", null, token);

export const apiUpdateBillingProfile = (token, data) =>
  request("PUT", "/api/me/billing-profile", data, token);

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
