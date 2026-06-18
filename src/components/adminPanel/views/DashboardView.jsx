import { StatCard, Badge } from '../shared';

const DashboardView = ({ leads, subscriptions, invoices }) => {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const MRR = activeSubscriptions.reduce((acc, s) => acc + parseFloat(s.monthly_fee || 0), 0);
  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const pendingAmount = pendingInvoices.reduce((acc, i) => acc + parseFloat(i.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Leads este mes"     value={leads.length} />
        <StatCard label="Clientes activos"   value={activeSubscriptions.length} color="green-600" />
        <StatCard label="MRR"                value={`€${MRR.toFixed(0)}`} sub="ingresos recurrentes mensuales" />
        <StatCard label="Pendiente de cobro" value={`€${pendingAmount.toFixed(0)}`} color="orange-500" />
      </div>

      {pendingInvoices.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-700 font-medium text-sm">
            ⚠️ {pendingInvoices.length} factura(s) pendiente(s) de cobro
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-navy mb-4">Últimos leads</h3>
        <div className="space-y-3">
          {leads.slice(0, 5).map(lead => (
            <div key={lead.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{lead.name}</p>
                <p className="text-xs text-gray-500">{lead.email}</p>
              </div>
              <Badge color="blue-500" size="sm">{lead.status}</Badge>
            </div>
          ))}
    
        </div>
      </div>
    </div>
  );
};

export default DashboardView;