import { FaCheck, FaMicrophone } from 'react-icons/fa';

function isVoiceCategory(label) {
  return label.toLowerCase().includes('voz') || label.toLowerCase().includes('voice');
}

export default function ComparisonTable({ comparison, lang = 'es' }) {
  if (!comparison) return null;

  const anchor = comparison.anchor_id || (lang === 'en' ? 'comparison' : 'comparativa');

  return (
    <div id={anchor} className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-extrabold text-navy text-center mb-12">
          {comparison.title}
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400 w-[32%]" />
                {comparison.plan_names.map((name, i) => (
                  <th
                    key={i}
                    className={`text-center py-4 px-4 text-sm font-bold ${
                      i === 1 ? 'text-cyan bg-cyan-pale/30' : 'text-navy'
                    }`}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.categories.map((cat, ci) => (
                <>
                  <tr key={`cat-${ci}`}>
                    <td
                      colSpan={comparison.plan_names.length + 1}
                      className="pt-6 pb-2 px-6 bg-gray-50"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {cat.label}
                      </span>
                    </td>
                  </tr>
                  {cat.rows.map((row, ri) => {
                    const voiceRow = isVoiceCategory(cat.label);
                    return (
                      <tr
                        key={`row-${ci}-${ri}`}
                        className={`border-t border-gray-100 ${
                          voiceRow ? 'bg-orange-50/30' : 'hover:bg-gray-50/50'
                        }`}
                      >
                        <td className="py-3 px-6 text-sm text-gray-700">
                          <span className="flex items-center gap-2">
                            {voiceRow && (
                              <FaMicrophone className="w-3 h-3 text-orange-400 flex-shrink-0" />
                            )}
                            {row.feature}
                          </span>
                        </td>
                        {row.values.map((val, vi) => (
                          <td
                            key={vi}
                            className={`py-3 px-4 text-center ${vi === 1 ? 'bg-cyan-pale/10' : ''}`}
                          >
                            {typeof val === 'boolean' ? (
                              val ? (
                                <FaCheck className="w-4 h-4 text-cyan mx-auto" />
                              ) : (
                                <span className="text-gray-300 text-lg leading-none">—</span>
                              )
                            ) : (
                              <span
                                className={`text-sm font-medium ${
                                  voiceRow ? 'text-orange-600' : 'text-navy'
                                }`}
                              >
                                {val}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {comparison.voice_note && (
          <p className="text-xs text-gray-400 mt-6 text-center">
            {comparison.voice_note}
          </p>
        )}
      </div>
    </div>
  );
}
