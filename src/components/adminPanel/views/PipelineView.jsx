import { Badge, PIPELINE_STAGES } from '../shared';

const PipelineView = ({ projects, onStageChange }) => (
  <div className="overflow-x-auto pb-4">
    <div className="flex gap-4 min-w-max">
      {PIPELINE_STAGES.map(stage => (
        <div key={stage} className="w-56 bg-gray-50 rounded-xl border border-gray-200 p-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 capitalize">{stage}</h4>
          <div className="space-y-2">
            {projects.filter(p => p.stage === stage).map(p => (
              <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <p className="text-sm font-medium text-navy">{p.name}</p>
                <p className="text-xs text-gray-500 mt-1">{p.client?.name || '—'}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge value={p.priority} map={{
                    high:   'bg-red-100 text-red-600',
                    medium: 'bg-yellow-100 text-yellow-600',
                    low:    'bg-gray-100 text-gray-500',
                  }} />
                  <select
                    className="text-xs border border-gray-200 rounded px-1 py-0.5 text-gray-600"
                    value={p.stage}
                    onChange={e => onStageChange(p.id, e.target.value)}
                  >
                    {PIPELINE_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {projects.filter(p => p.stage === stage).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Vacío</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PipelineView;