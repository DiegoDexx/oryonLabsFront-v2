import { useState } from 'react';
import { Badge, PIPELINE_STAGES } from '../shared';
import { useAdminT } from '../../../context/AdminLangContext';
import { apiDeleteProject } from '../../../api/apiActions';
import Modal from '../../ui/Modal';

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PipelineView = ({ projects, onStageChange, token, onDeleteProject }) => {
  const { t } = useAdminT();
  const cd = t.confirm_delete;

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState(null);

  const openDelete  = (e, id, name) => { e.stopPropagation(); setDeleteError(null); setDeleteTarget({ id, name }); };
  const closeDelete = () => { setDeleteTarget(null); setDeleteError(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiDeleteProject(token, deleteTarget.id);
      onDeleteProject(deleteTarget.id);
      closeDelete();
    } catch (err) {
      setDeleteError(err.message || t.common.unexpected_error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {PIPELINE_STAGES.map(stage => (
            <div key={stage} className="w-56 bg-gray-50 rounded-xl border border-gray-200 p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 capitalize">{stage}</h4>
              <div className="space-y-2">
                {projects.filter(p => p.project?.stage === stage).map(p => (
                  <div key={p.project?.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-medium text-navy leading-tight">{p.project?.name}</p>
                      <button
                        onClick={(e) => openDelete(e, p.project?.id, p.project?.name)}
                        className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition"
                        title={t.projects?.delete_btn}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{p.client?.name || '—'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge value={p.project?.priority} map={{
                        high:   'bg-red-100 text-red-600',
                        medium: 'bg-yellow-100 text-yellow-600',
                        low:    'bg-gray-100 text-gray-500',
                      }} />
                      <select
                        className="text-xs border border-gray-200 rounded px-1 py-0.5 text-gray-600"
                        value={p.project?.stage}
                        onChange={e => onStageChange(p.project?.id, e.target.value)}
                      >
                        {PIPELINE_STAGES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {projects.filter(p => p.project?.stage === stage).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">{t.pipeline.empty_stage}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!deleteTarget} onClose={closeDelete} title={cd.title}>
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">⚠️</div>
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-navy text-lg">
                {cd.prefix} <span className="text-red-500">{deleteTarget.name}</span>?
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-red-600 text-xs">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={closeDelete}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                {t.common.cancel}
              </button>
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition">
                {deleting ? cd.deleting : cd.confirm}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PipelineView;
