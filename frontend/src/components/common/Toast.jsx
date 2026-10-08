import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ toast, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      bg: 'var(--bg-surface)',
      border: 'var(--success)',
      iconColor: 'var(--success)',
      titleColor: 'var(--text-primary)',
    },
    error: {
      icon: XCircle,
      bg: 'var(--bg-surface)',
      border: 'var(--danger)',
      iconColor: 'var(--danger)',
      titleColor: 'var(--text-primary)',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'var(--bg-surface)',
      border: 'var(--warning)',
      iconColor: 'var(--warning)',
      titleColor: 'var(--text-primary)',
    },
    info: {
      icon: Info,
      bg: 'var(--bg-surface)',
      border: 'var(--info)',
      iconColor: 'var(--info)',
      titleColor: 'var(--text-primary)',
    },
  };

  const c = config[toast.type] || config.info;
  const Icon = c.icon;

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl max-w-sm animate-slide-up"
      style={{
        background: c.bg,
        border: `1px solid var(--border)`,
        borderLeft: `3px solid ${c.border}`,
        boxShadow: 'var(--shadow-lg)',
      }}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: c.iconColor }} />
      <p className="text-sm font-medium leading-snug flex-1" style={{ color: c.titleColor }}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="shrink-0 transition-colors p-0.5 rounded"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;
