import { useState, useEffect, useCallback } from "react";
import { useAdminT } from "../../../context/AdminLangContext";
import { apiGetBillingProfile, apiUpdateBillingProfile } from "../../../api/apiActions";
import { BILLING_PROFILE_SECTIONS, translateFields } from "../billing";

const ALL_FIELDS = Object.values(BILLING_PROFILE_SECTIONS).flat();
const WIDE_FIELDS = new Set(["legal_name", "address_line1", "account_name", "iban", "footer_notes"]);

const toForm = (profile) =>
  Object.fromEntries(ALL_FIELDS.map((k) => [k, profile?.[k] ?? ""]));

const BillingSettingsView = ({ token, onToast }) => {
  const { t } = useAdminT();
  const ts = t.billing_settings;
  const fl = t.billing.fields;

  const [data, setData]         = useState(null);
  const [form, setForm]         = useState(toForm(null));
  const [loading, setLoading]   = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState({});

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setLoadError(null);
    try {
      const d = await apiGetBillingProfile(token);
      setData(d);
      setForm(toForm(d?.billing_profile));
    } catch (err) {
      setLoadError(err.status ? `${err.status} · ${err.message}` : err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const locked = !!data?.from_email_locked;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // PUT hace merge parcial: solo se mandan los campos que cambian; vacío → null (borra).
    // from_email bloqueado nunca se envía (el backend daría 422 si cambiara).
    const original = toForm(data?.billing_profile);
    const payload = Object.fromEntries(
      ALL_FIELDS
        .filter((k) => !(k === "from_email" && locked))
        .filter((k) => String(form[k]).trim() !== String(original[k]).trim())
        .map((k) => {
          const v = String(form[k]).trim();
          if (!v) return [k, null];
          return [k, k === "payment_terms_days" ? Number(v) : v];
        })
    );

    if (Object.keys(payload).length === 0) { onToast(ts.no_changes, "warning"); return; }

    setSaving(true);
    setErrors({});
    try {
      await apiUpdateBillingProfile(token, payload);
      onToast(t.toasts.billing_profile_saved);
      await load();
    } catch (err) {
      const fieldErrors = err.data?.errors
        ? Object.fromEntries(Object.entries(err.data.errors).map(([k, v]) => [k, v[0]]))
        : {};
      setErrors({ ...fieldErrors, submit: err.message || t.common.unexpected_error });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm shadow-sm">
        {ts.loading}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
        <p className="text-sm font-semibold text-red-700">{ts.load_error}</p>
        <p className="text-xs text-red-600">{loadError}</p>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-medium hover:bg-red-100 transition"
        >
          {ts.retry}
        </button>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20"
    }`;

  const renderField = (k) => {
    const isLocked = k === "from_email" && locked;
    const common = {
      value: form[k],
      onChange: handleChange(k),
      disabled: isLocked,
      className: inputClass(k),
    };
    return (
      <div key={k} className={WIDE_FIELDS.has(k) ? "sm:col-span-2" : ""}>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          {fl[k]}
          {data?.missing?.includes(k) && <span className="text-amber-500 ml-1">*</span>}
        </label>
        {k === "footer_notes" ? (
          <textarea rows={3} maxLength={1000} {...common} className={`${common.className} resize-none`} />
        ) : (
          <span title={isLocked ? ts.from_email_locked : undefined} className="block">
            <input
              type={k === "payment_terms_days" ? "number" : (k === "from_email" || k === "reply_to") ? "email" : "text"}
              {...(k === "payment_terms_days" ? { min: 0, max: 365 } : {})}
              {...(k === "sort_code" ? { placeholder: "12-34-56" } : {})}
              {...common}
            />
          </span>
        )}
        {isLocked && <p className="text-gray-400 text-xs mt-1">{ts.from_email_locked}</p>}
        {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Indicador de completitud */}
      {data?.complete ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span aria-hidden="true">✅</span>
          <p className="text-sm font-medium text-green-800">{ts.complete}</p>
        </div>
      ) : (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span aria-hidden="true">⚠️</span>
          <p className="text-sm text-amber-800">
            {ts.missing.replace("{missing}", translateFields(data?.missing, fl))}
          </p>
        </div>
      )}

      <p className="text-sm text-gray-500">{ts.intro}</p>

      {Object.entries(BILLING_PROFILE_SECTIONS).map(([section, fields]) => (
        <div key={section} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{ts.sections[section]}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(renderField)}
          </div>
        </div>
      ))}

      {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-cyan hover:bg-cyan-medium disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          {saving ? ts.saving : ts.save}
        </button>
      </div>
    </form>
  );
};

export default BillingSettingsView;
