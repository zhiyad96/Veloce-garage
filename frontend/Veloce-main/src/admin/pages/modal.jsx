import React from "react";

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  type = "alert",
}) {
  if (!show) return null;

  const typeColor =
    type === "warning"
      ? "from-red-600 to-red-700"
      : type === "success"
      ? "from-green-600 to-green-700"
      : "from-blue-600 to-blue-700";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`px-6 py-3 bg-gradient-to-r ${typeColor} text-white rounded-xl transition-all font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
