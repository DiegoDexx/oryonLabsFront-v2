import Modal from "../ui/Modal";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, entityName, warningText, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirmar eliminación">
    <div className="space-y-5">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">
          ⚠️
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="font-semibold text-navy text-lg">¿Eliminar {entityName}?</p>
        {warningText && (
          <p className="text-sm text-gray-500 leading-relaxed">{warningText}</p>
        )}
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition"
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDeleteModal;