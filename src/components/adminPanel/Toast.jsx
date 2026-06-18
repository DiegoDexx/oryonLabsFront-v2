import { useEffect } from "react";

const STYLES = {
  success: "bg-green-500",
  error:   "bg-red-500",
  warning: "bg-yellow-500",
};

const ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
};

const Toast = ({ message, type = "success", visible, onHide }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 3000);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-white shadow-lg text-sm font-medium ${STYLES[type]}`}
      style={{ animation: "toastIn 0.2s ease-out" }}
    >
      <span>{ICONS[type]}</span>
      <span>{message}</span>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default Toast;