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

/** Ruta pública — no requiere token (usado desde el formulario de la web) */
export const apiSubmitLeadForm = (data) =>
  request("POST", "/api/leads", data, null);

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
export const apiGetProjects = (token) =>
  request("GET", "/api/admin/projects/full", null, token);

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
