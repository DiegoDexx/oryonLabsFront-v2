// Facturación PSR → sus clientes (client-invoices). Sistema separado de la
// facturación OryonX (/api/invoices, InvoicesView) — no mezclar.

// Mismo orden/claves que Client::BILLING_DETAILS_FIELDS en el backend.
export const BILLING_DETAILS_FIELDS = [
  'legal_name', 'vat_number', 'address_line1', 'address_line2', 'city', 'postcode', 'country',
];

// bill_to = billing_details + contacto. Sin email el envío falla con
// destination_email_missing, así que el formulario de destinatario lo incluye.
export const BILL_TO_FIELDS = [...BILLING_DETAILS_FIELDS, 'email', 'phone'];

// Mismo orden/claves que Organization::BILLING_PROFILE_FIELDS.
export const BILLING_PROFILE_SECTIONS = {
  identity: ['legal_name', 'vat_number', 'company_number'],
  address:  ['address_line1', 'address_line2', 'city', 'postcode', 'country'],
  bank:     ['bank_name', 'account_name', 'sort_code', 'account_number', 'iban', 'payment_terms_days'],
  sending:  ['from_email', 'reply_to', 'footer_notes'],
};

export const CLIENT_INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue'];

export const CLIENT_INVOICE_STATUS_COLOR = {
  draft:   'default',
  sent:    'info',
  paid:    'success',
  overdue: 'error',
};

export const PAYMENT_METHOD_SUGGESTIONS = ['bank_transfer', 'card', 'cash'];

// Reglas de negocio de la UI (el backend solo bloquea el borrado de no-draft).
export const canEditInvoice     = (inv) => inv.status === 'draft';
export const canDeleteInvoice   = (inv) => inv.status === 'draft';
export const canSendInvoice     = (inv) => inv.status === 'draft' || inv.status === 'overdue';
export const canMarkInvoicePaid = (inv) => inv.status === 'sent'  || inv.status === 'overdue';

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

/** amount llega como string decimal ("240.00"). */
export const formatGBP = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  return Number.isFinite(n) ? gbp.format(n) : '—';
};

/** Fechas de Laravel (ISO o YYYY-MM-DD) → valor para <input type="date">. */
export const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

export const invoiceClientName = (inv) =>
  inv.bill_to?.legal_name ?? inv.client?.name ?? inv.tradeJob?.lead?.name ?? inv.trade_job?.lead?.name ?? '—';

/** Email al que se enviaría la factura, si el frontend puede saberlo. */
export const invoiceDestinationEmail = (inv) =>
  inv.bill_to?.email ?? inv.client?.email ?? inv.tradeJob?.lead?.email ?? inv.trade_job?.lead?.email ?? null;

/** ['legal_name', 'postcode'] → "Razón social, Código postal" */
export const translateFields = (keys, fieldLabels) =>
  (keys ?? []).map((k) => fieldLabels?.[k] ?? k).join(', ');

/** Error de API → mensaje legible usando el código `error` del backend. */
export const clientInvoiceErrorMessage = (err, ti, fieldLabels) => {
  const code    = err?.data?.error;
  const missing = translateFields(err?.data?.missing, fieldLabels);
  const msg     = code ? ti.errors?.[code] : null;
  if (msg) return msg.replace('{missing}', missing);
  if (code === 'module_not_available') return ti.module_unavailable;
  return err?.message || null;
};
