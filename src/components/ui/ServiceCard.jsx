import { Link } from 'react-router-dom';

export default function ServiceCard({ icon, badge, title, description, color = 'cyan', link, comingSoon = false, lang = 'es', className = '' }) {
  {/* Single brand color family (navy/cyan) so the 6-card grid reads as
      one system, not six unrelated categories — see Ley de Pragnanz. */}
  const colorClasses = {
    cyan: 'bg-cyan text-white',
    navy: 'bg-navy text-white',
  };

  const badgeColors = {
    cyan: 'bg-cyan-pale text-cyan-dark',
    navy: 'bg-navy/10 text-navy',
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

  const baseClass = `group flex flex-col bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
    link
      ? 'hover:border-cyan/30 cursor-pointer'
      : comingSoon
      ? 'opacity-75 cursor-default'
      : ''
  } ${className}`;

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
