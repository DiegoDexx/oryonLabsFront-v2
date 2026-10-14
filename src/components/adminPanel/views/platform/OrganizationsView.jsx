import { useAdminT } from '../../../../context/AdminLangContext';

const VERTICAL_STYLES = {
  field_service: 'bg-blue-100 text-blue-700',
  legal:         'bg-purple-100 text-purple-700',
  clinic:        'bg-green-100 text-green-700',
};

const formatDate = (dateStr, lang) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const OrganizationsView = ({ organizations, loading, onViewPerformance }) => {
  const { t, lang } = useAdminT();
  const to = t.organizations;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {to.title}{' '}
              <span className="text-gray-400 font-normal">({organizations.length})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{to.subtitle}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">{to.loading}</div>
        ) : organizations.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">{to.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3">{to.headers.name}</th>
                  <th className="text-left px-6 py-3">{to.headers.plan}</th>
                  <th className="text-left px-6 py-3">{to.headers.vertical}</th>
                  <th className="text-left px-6 py-3">{to.headers.status}</th>
                  <th className="text-left px-6 py-3">{to.headers.users}</th>
                  <th className="text-left px-6 py-3">{to.headers.created}</th>
                  <th className="text-right px-6 py-3">{to.headers.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50/40 transition">
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-gray-900">{org.name}</div>
                      {org.slug && <div className="text-xs text-gray-400">{org.slug}</div>}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 capitalize">{org.plan}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${VERTICAL_STYLES[org.vertical] ?? 'bg-gray-100 text-gray-600'}`}>
                        {org.vertical ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        org.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {org.is_active ? to.active : to.inactive}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{org.users_count ?? 0}</td>
                    <td className="px-6 py-3.5 text-gray-500">{formatDate(org.created_at, lang)}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => onViewPerformance(org.id)}
                          className="text-xs text-navy hover:text-white hover:bg-navy transition px-2.5 py-1.5 rounded-lg border border-navy/30"
                        >
                          {to.view_performance}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsView;
