import { FaCheckCircle, FaTimes } from "react-icons/fa";

const SuccessModal = ({ show, onClose, message, title }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-navy mb-3">{title || "¡Solicitud enviada!"}</h2>
        <p className="text-gray-600 mb-6">
          {message || "Tu solicitud ha sido procesada correctamente."}
        </p>

        <button
          onClick={onClose}
          className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-3 rounded-lg transition-all w-full"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
