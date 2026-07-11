import { FaCheck, FaMicrophone, FaArrowRight } from 'react-icons/fa';

function isVoiceCategory(label) {
  return label.toLowerCase().includes('voz') || label.toLowerCase().includes('voice');
}

function PlanButton({ text, isPro, href, small = false }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center w-full rounded-lg font-semibold text-center transition-all ${
        small ? 'py-2 px-2 text-xs' : 'py-2.5 px-3 text-sm'
      } ${
        isPro
          ? 'bg-cyan hover:bg-cyan-medium text-white shadow-sm shadow-cyan/20'
          : 'bg-navy hover:opacity-90 text-white'
      }`}
    >
      {text}
    </a>
  );
}

export default function ComparisonTable({ comparison, plans = [], symbol = '€', perMonth = '/mes', lang = 'es' }) {
  if (!comparison) return null;

  const anchor = comparison.anchor_id || (lang === 'en' ? 'comparison' : 'comparativa');
  const contactAnchor = `#${lang === 'en' ? 'contact' : 'contacto'}`;
  const consultLabel = comparison.consult_label || (lang === 'en' ? 'Consult' : 'Consultar');

  const headerBg = (i) => (i === 1 ? 'bg-cyan-50' : 'bg-white');
  const cellTint = (i) => (i === 1 ? 'bg-cyan-pale/20' : '');
  const cellBorder = (i) => (i === 1 ? 'border-x border-cyan-100' : '');

  const isConsultValue = (val) =>
    typeof val === 'string' && val.trim().toLowerCase() === consultLabel.trim().toLowerCase();

  return (
    <div id={anchor} className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-extrabold text-navy text-center mb-12">
          {comparison.title}
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm [overflow-y:visible]">
          <table className="w-full min-w-[720px] border-collapse">
            <thead className="sticky top-16 lg:top-20 z-20">
              <tr>
                <th className={`text-left py-4 px-6 text-sm font-semibold text-gray-400 w-[28%] border-b border-gray-100 ${headerBg(-1)}`} />
                {comparison.plan_names.map((name, i) => {
                  const plan = plans[i];
                  return (
                    <th
                      key={i}
                      className={`text-center py-4 px-4 border-b border-gray-100 ${headerBg(i)} ${cellBorder(i)} ${
                        i === 1 ? 'text-cyan' : 'text-navy'
                      }`}
                    >
                      <div className="text-sm font-bold">{name}</div>
                      {plan && (
                        <div className={`mt-0.5 text-xs font-medium ${i === 1 ? 'text-cyan-dark' : 'text-gray-500'}`}>
                          {plan.price_prefix ? `${plan.price_prefix} ` : ''}
                          {symbol}{plan.price_monthly}{perMonth}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-100">
                <td className={`py-3 px-6 ${headerBg(-1)}`} />
                {comparison.plan_names.map((_, i) => (
                  <td key={i} className={`py-3 px-3 ${headerBg(i)} ${cellBorder(i)}`}>
                    {plans[i] && (
                      <PlanButton text={plans[i].cta} isPro={i === 1} href={contactAnchor} small />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>

            {comparison.categories.map((cat, ci) => {
              const voiceRow = isVoiceCategory(cat.label);
              return (
                <tbody key={ci}>
                  <tr>
                    <td className="pt-6 pb-2 px-6 bg-gray-50">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {cat.label}
                      </span>
                    </td>
                    {comparison.plan_names.map((_, vi) => (
                      <td
                        key={vi}
                        className={`pt-6 pb-2 px-4 ${cellBorder(vi)} ${vi === 1 ? 'bg-cyan-pale/40' : 'bg-gray-50'}`}
                      />
                    ))}
                  </tr>
                  {cat.rows.map((row, ri) => (
                    <tr
                      key={`row-${ci}-${ri}`}
                      className={`border-t border-gray-100 ${voiceRow ? 'bg-orange-50/30' : 'hover:bg-gray-50/50'}`}
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
                          className={`py-3 px-4 text-center ${cellBorder(vi)} ${cellTint(vi)}`}
                        >
                          {typeof val === 'boolean' ? (
                            val ? (
                              <FaCheck className="w-4 h-4 text-cyan mx-auto" />
                            ) : (
                              <span className="text-gray-300 text-lg leading-none">—</span>
                            )
                          ) : isConsultValue(val) ? (
                            <a
                              href={contactAnchor}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 underline decoration-dotted underline-offset-2 transition-colors"
                            >
                              {val}
                              <FaArrowRight className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span
                              className={`text-sm font-medium ${voiceRow ? 'text-orange-600' : 'text-navy'}`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              );
            })}

            <tfoot>
              <tr className="border-t border-gray-100">
                <td className="py-5 px-6" />
                {comparison.plan_names.map((_, i) => (
                  <td key={i} className={`py-5 px-3 ${cellBorder(i)} ${i === 1 ? 'bg-cyan-pale/10' : ''}`}>
                    {plans[i] && (
                      <PlanButton text={plans[i].cta} isPro={i === 1} href={contactAnchor} />
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {comparison.voice_note && (
          <p className="text-xs text-gray-400 mt-6 text-center">
            {comparison.voice_note}
          </p>
        )}

        {comparison.closing_cta && (
          <div className="mt-10 rounded-[32px] border border-gray-200 bg-navy px-8 py-10 sm:py-12 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-2">{comparison.closing_cta.title}</h3>
                <p className="text-cyan-100 text-sm sm:text-base max-w-md">{comparison.closing_cta.subtitle}</p>
              </div>
              <a
                href={contactAnchor}
                className="flex-shrink-0 bg-cyan hover:bg-cyan-medium text-white font-semibold px-7 py-3.5 rounded-lg transition-all whitespace-nowrap"
              >
                {comparison.closing_cta.cta}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
