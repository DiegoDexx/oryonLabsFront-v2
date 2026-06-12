export const PLAN_BADGE = {
  starter:      'bg-gray-100 text-gray-700',
  pro:          'bg-cyan/10 text-cyan',
  professional: 'bg-blue-100 text-blue-700',
  voice_ai:     'bg-purple-100 text-purple-700',
};

export const STATUS_BADGE = {
  active:    'bg-green-100 text-green-700',
  paused:    'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  pending:   'bg-orange-100 text-orange-700',
  paid:      'bg-green-100 text-green-700',
  overdue:   'bg-red-100 text-red-700',
};

export const PIPELINE_STAGES = [
  'lead', 'contacted', 'proposal',
  'negotiation', 'onboarding', 'active'
];

export const StatCard = ({ label, value, sub, color = 'cyan' }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold text-${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export const Badge = ({ value, map, fallback = 'bg-gray-100 text-gray-600' }) => (
  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${map?.[value] || fallback}`}>
    {value || '—'}
  </span>
);

export const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
  </div>
);