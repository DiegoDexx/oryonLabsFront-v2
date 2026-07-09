import { Link } from 'react-router-dom';

export default function ServiceCard({ icon, badge, title, description, color = 'cyan', link, comingSoon = false, lang = 'es' }) {
  const colorClasses = {
    cyan: 'bg-cyan text-white',
    purple: 'bg-purple-500 text-white',
    green: 'bg-emerald-500 text-white',
    orange: 'bg-orange-500 text-white',
    blue: 'bg-blue-500 text-white',
    indigo: 'bg-indigo-500 text-white',
  };

  const badgeColors = {
    cyan: 'bg-cyan-pale text-cyan-dark',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-emerald-100 text-emerald-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };

  const cardContent = (
    <>
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
          colorClasses[color] || colorClasses.cyan
        } ${comingSoon ? 'opacity-60' : ''}`}
      >
        {icon}
      </div>

      {/* Badge row */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            badgeColors[color] || badgeColors.cyan
          }`}
        >
          {badge}
        </span>
        {comingSoon && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
            Próximamente
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`text-xl font-bold text-navy mb-3 transition-colors ${link ? 'group-hover:text-cyan' : ''}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>

      {/* Arrow hint for linked cards */}
      {link && (
        <p className={`mt-4 text-xs font-semibold text-cyan opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
          Saber más
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      )}
    </>
  );

  const baseClass = `group bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-300 ${
    link
      ? 'hover:border-cyan/30 hover:shadow-xl cursor-pointer'
      : comingSoon
      ? 'opacity-75 cursor-default'
      : ''
  }`;

  if (link) {
    return (
      <Link to={`/${lang}/servicios/${link}`} className={baseClass}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={baseClass}>
      {cardContent}
    </div>
  );
}
