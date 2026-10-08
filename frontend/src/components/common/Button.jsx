import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-sm",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
