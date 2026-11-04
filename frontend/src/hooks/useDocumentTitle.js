import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | SaaS Expense Analytics` : 'SaaS Expense Analytics';
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
