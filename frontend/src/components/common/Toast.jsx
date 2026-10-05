import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

/**
 * Toast notification component.
 * Props:
 *   toast: { type: 'success' | 'error', message: string } | null
 *   onClose: () => void
 *   duration: number (ms, default 4000)
 */
const Toast = ({ toast, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm animate-slide-up
        ${isSuccess
          ? 'bg-emerald-900/90 border-emerald-700/60 text-emerald-100'
          : 'bg-red-900/90 border-red-700/60 text-red-100'
        }`}
      role="alert"
    >
      {isSuccess
        ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      }
      <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
