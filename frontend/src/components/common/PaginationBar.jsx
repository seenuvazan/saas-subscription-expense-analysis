import React from 'react';

export function PaginationBar({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-xs text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-xs font-medium rounded bg-slate-800 text-slate-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
