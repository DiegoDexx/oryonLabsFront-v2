export default function ServiceCard({ icon, badge, title, description, color = 'cyan' }) {
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

  return (
    <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-cyan/30 hover:shadow-xl transition-all duration-300">
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
          colorClasses[color] || colorClasses.cyan
        }`}
      >
        {icon}
      </div>

      {/* Badge */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          badgeColors[color] || badgeColors.cyan
        }`}
      >
        {badge}
      </span>

      {/* Title */}
      <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-cyan transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
