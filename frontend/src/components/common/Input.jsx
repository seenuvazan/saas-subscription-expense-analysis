import React from 'react';

export function Input({ label, error, helperText, className = '', id, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-slate-950 border ${error ? 'border-rose-500' : 'border-slate-800'} rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
