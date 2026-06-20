import { useState } from 'react';
import { useAdminT } from '../../../../../context/AdminLangContext';
import { getChannelConfig } from './helpers';

const inRange = (dateStr, range) => {
  if (!dateStr) return false;
  const d   = new Date(dateStr);
  const now = new Date();
  if (range === 'week')  return d >= new Date(now - 7 * 86400000);
  if (range === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  if (range === '6m') return d >= new Date(now.getFullYear(), now.getMonth() - 5, 1);
  return true;
};

const ChannelCards = ({ leads }) => {
  const { t } = useAdminT();
  const td = t.dashboard.adquisicion;
  const channelConfig = getChannelConfig(t.dashboard.channels);
  const [range, setRange] = useState('month');

  const RANGES = [
    { key: 'week',  label: td.range_week  },
    { key: 'month', label: td.range_month },
    { key: '6m',    label: td.range_6m   },
  ];

  const filtered = leads.filter(l => inRange(l.created_at, range));
  const total    = filtered.length;

  const counts = filtered.reduce((acc, l) => {
    const ch = (l.channel || 'manual').toLowerCase();
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max    = sorted[0]?.[1] || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-navy">{td.channels_title}</h3>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {RANGES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === key
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{td.channels_empty}</p>
      ) : (
        <div className="space-y-4">
          {sorted.map(([channel, count]) => {
            const cfg = channelConfig[channel] || {
              label: channel, bar: 'bg-gray-400',
              pill: 'bg-gray-100 text-gray-600', icon: '📌',
            };
            const pct = Math.round((count / total) * 100);
            return (
              <div key={channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cfg.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                      {count} lead{count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                    style={{ width: `${Math.round((count / max) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Total: <span className="font-semibold text-gray-600">{total}</span> leads
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelCards;