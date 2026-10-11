// Helpers for the capture-form fields shown on leads (sector, chosen plan).
// Kept apart from shared.jsx: that file's PLAN_* maps are keyed by the
// INTERNAL suggested_plan enum (starter/pro/professional/voice_ai), while the
// `plan` field on a lead is the PUBLIC plan name the customer picked.

export const SECTOR_IDS = ['reformas_oficios', 'clinica_salud', 'despacho_legal', 'otro'];

export const SECTOR_BADGE = {
  reformas_oficios: 'bg-orange-100 text-orange-700',
  clinica_salud:    'bg-teal-100 text-teal-700',
  despacho_legal:   'bg-indigo-100 text-indigo-700',
  otro:             'bg-gray-100 text-gray-600',
};

// Outlined, so it never reads as the filled suggested_plan badges.
export const PLAN_CHOSEN_BADGE = 'border border-cyan/40 bg-white text-cyan';

const PUBLIC_PLANS = ['Starter', 'Growth', 'Pro', 'Business'];

/**
 * Returns the public plan name if `value` is one, otherwise null. The form
 * used to store its "not sure yet" pill text in `plan`, so anything that is
 * not a real plan name must not be rendered as a plan.
 */
export const getChosenPlan = (value) => {
  const v = String(value ?? '').trim().toLowerCase();
  return PUBLIC_PLANS.find((p) => p.toLowerCase() === v) || null;
};

/** Human label for a lead's sector, or null when it has none. Never the raw slug. */
export const getSectorLabel = (sector, sectorOther, labels) => {
  if (!sector) return null;
  if (sector === 'otro') return (sectorOther || '').trim() || labels.otro;
  return labels[sector] || labels.otro;
};
