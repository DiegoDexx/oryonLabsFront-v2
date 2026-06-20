export const getMonthKey = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const getLastNMonths = (n, lang = 'es') => {
  const months = [];
  const now = new Date();
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString(locale, { month: 'short' }),
    });
  }
  return months;
};

export const isLastMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
};

export const growthPct = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

export const getChannelConfig = (channelLabels) => ({
  form:     { label: channelLabels.form,     bar: 'bg-cyan',       pill: 'bg-cyan/10 text-cyan',          convBar: 'bg-cyan',       icon: '📝' },
  chatbot:  { label: channelLabels.chatbot,  bar: 'bg-purple-500', pill: 'bg-purple-100 text-purple-700', convBar: 'bg-purple-500', icon: '🤖' },
  whatsapp: { label: channelLabels.whatsapp, bar: 'bg-green-500',  pill: 'bg-green-100 text-green-700',   convBar: 'bg-green-500',  icon: '💬' },
  phone:    { label: channelLabels.phone,    bar: 'bg-blue-500',   pill: 'bg-blue-100 text-blue-700',     convBar: 'bg-blue-500',   icon: '📞' },
  manual:   { label: channelLabels.manual,   bar: 'bg-gray-400',   pill: 'bg-gray-100 text-gray-600',     convBar: 'bg-gray-400',   icon: '✏️' },
});
