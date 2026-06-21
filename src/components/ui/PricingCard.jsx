import { FaCheck, FaStar } from 'react-icons/fa';

export default function PricingCard({
  name,
  subtitle,
  setupRange,
  monthlyRange,
  monthlyPrefix = '',
  perMonth = '/mes',
  setupLabel = 'Setup inicial',
  monthlyLabel = 'Mensualidad',
  description,
  features,
  isPopular = false,
  ctaText = 'Empezar',
  isDark = false,
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${
        isDark
          ? 'bg-navy text-white shadow-2xl'
          : 'bg-white border border-gray-200 text-navy hover:border-cyan/50 hover:shadow-xl'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <FaStar className="w-3 h-3" />
          Más popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
          {!isPopular && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-cyan-pale'}`}>
              <FaStar className={`w-4 h-4 ${isDark ? 'text-cyan-light' : 'text-cyan'}`} />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            {isPopular && <span className="text-cyan-light text-xs">El más popular</span>}
          </div>
        </div>
        {subtitle && (
          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-cyan'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-6 space-y-4">
        <div>
          <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {setupLabel}
          </p>
          <p className="text-2xl font-bold">{setupRange}</p>
        </div>
        <div>
          <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {monthlyLabel}
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-navy'}`}>
            {monthlyPrefix && (
              <span className="text-base font-normal">{monthlyPrefix} </span>
            )}
            {monthlyRange}
            <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {perMonth}
            </span>
          </p>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {description}
      </p>

      {/* CTA Button */}
      <button
        className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
          isPopular || isDark
            ? 'bg-cyan hover:bg-cyan-medium text-white'
            : 'bg-navy hover:bg-navy-light text-white'
        }`}
      >
        {ctaText}
      </button>

      {/* Features divider */}
      <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-100'} mb-6`} />

      {/* Features */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <FaCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-light' : 'text-cyan'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
