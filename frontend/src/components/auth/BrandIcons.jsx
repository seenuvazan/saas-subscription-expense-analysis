import React from 'react';

export const BrandIcons = {
  ChatGPT: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path
        fill="#10A37F"
        d="M22.28 9.87a5.98 5.98 0 0 0-.52-4.93 6.07 6.07 0 0 0-6.52-2.8 6.03 6.03 0 0 0-4.63-2.14 6.06 6.06 0 0 0-5.77 4.2 6.02 6.02 0 0 0-4.04 2.92 6.06 6.06 0 0 0 .74 7.08 5.98 5.98 0 0 0 .52 4.93 6.07 6.07 0 0 0 6.52 2.8 6.03 6.03 0 0 0 4.63 2.14 6.06 6.06 0 0 0 5.77-4.2 6.02 6.02 0 0 0 4.04-2.92 6.06 6.06 0 0 0-.74-7.08ZM12.63 21.9a4.55 4.55 0 0 1-3.13-1.25l.16-.09 5.2-3a.77.77 0 0 0 .39-.67v-7.35l2.21 1.28a.07.07 0 0 1 .04.05v6.49a4.58 4.58 0 0 1-4.87 4.54ZM3.5 17.5a4.54 4.54 0 0 1-.58-3.32l.16.1 5.2 3a.78.78 0 0 0 .78 0l6.36-3.67v2.55a.07.07 0 0 1-.03.06l-5.62 3.25a4.57 4.57 0 0 1-6.27-1.97ZM2.83 8.35a4.53 4.53 0 0 1 2.55-2.07v6.2a.77.77 0 0 0 .38.67l6.37 3.68-2.21 1.28a.07.07 0 0 1-.07 0L4.23 14.86a4.57 4.57 0 0 1-1.4-6.51Zm15.82 3.32-6.37-3.68 2.21-1.28a.07.07 0 0 1 .07 0l5.62 3.25a4.57 4.57 0 0 1-1.15 8.38v-6a.77.77 0 0 0-.38-.67Zm2.52-3.82a4.53 4.53 0 0 1 .58 3.32l-.16-.09-5.2-3a.78.78 0 0 0-.78 0L9.25 11.75V9.2a.07.07 0 0 1 .03-.06l5.62-3.25a4.57 4.57 0 0 1 6.45 1.96ZM8.84 10.3l2.21-1.28 2.21 1.28v2.55l-2.21 1.28-2.21-1.28v-2.55Z"
      />
    </svg>
  ),
  Claude: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="5" fill="#D97757" />
      <path
        d="M13.8 6.5h2.4l-4.5 11h-2.3l4.4-11Zm-5.3 4.7 1.8-4.7h2.2l-3.2 8.4H7.2L4.5 17.5h2.4l.6-1.6h2.8l.6 1.6h2.4l-4.2-11H8.5Zm-1.8 4.2.9-2.5.9 2.5H6.7Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  Gemini: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A87FF" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
        fill="url(#gemini-grad)"
      />
    </svg>
  ),
  GitHub: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
        fill="#181717"
      />
    </svg>
  ),
  Figma: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
      <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF" />
      <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
      <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
      <path d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z" fill="#1ABCFE" />
    </svg>
  ),
  Notion: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="4" fill="#000000" />
      <path
        d="M6.5 6.5L16.2 6.5C16.9 6.5 17.5 7.1 17.5 7.8V16.2C17.5 16.9 16.9 17.5 16.2 17.5H7.8C7.1 17.5 6.5 16.9 6.5 16.2V6.5Z"
        fill="white"
      />
      <path
        d="M8.8 8.4V15.6H10.1V10.4L13.8 15.6H15.1V8.4H13.8V13.6L10.1 8.4H8.8Z"
        fill="#000000"
      />
    </svg>
  ),
  Slack: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 15a2.5 2.5 0 1 0-2.5-2.5H6V15Zm1.25 0a2.5 2.5 0 0 0 5 0V7.5a2.5 2.5 0 0 0-5 0V15Z" fill="#E01E5A" />
      <path d="M9 6a2.5 2.5 0 1 0 2.5-2.5V6H9Zm0 1.25a2.5 2.5 0 0 0 0 5h7.5a2.5 2.5 0 0 0 0-5H9Z" fill="#36C5F0" />
      <path d="M18 9a2.5 2.5 0 1 0 2.5 2.5H18V9Zm-1.25 0a2.5 2.5 0 0 0-5 0v7.5a2.5 2.5 0 0 0 5 0V9Z" fill="#2EB67D" />
      <path d="M15 18a2.5 2.5 0 1 0-2.5 2.5V18h2.5Zm0-1.25a2.5 2.5 0 0 0 0-5H7.5a2.5 2.5 0 0 0 0 5H15Z" fill="#ECB22E" />
    </svg>
  ),
  Zoom: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#2D8CFF" />
      <path
        d="M5 8.5C5 7.67 5.67 7 6.5 7h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7A1.5 1.5 0 0 1 5 15.5v-7Zm11 2.3 3.3-2.2a.5.5 0 0 1 .7.42v5.96a.5.5 0 0 1-.7.42L16 13.2v-2.4Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  Canva: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="11" fill="url(#canva-grad)" />
      <defs>
        <linearGradient id="canva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C4CC" />
          <stop offset="100%" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
      <path
        d="M12.8 15.8c-2.3 0-3.6-1.6-3.6-3.7 0-2.6 1.8-4.5 4.3-4.5 1.8 0 2.8.9 3 1.9l-1.5.5c-.2-.6-.7-1-1.5-1-1.4 0-2.5 1.2-2.5 3 0 1.5.8 2.5 2.2 2.5 1 0 1.7-.5 2-1.3l1.5.6c-.6 1.2-1.8 2-3.4 2Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  Microsoft365: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="3" y="3" width="8.5" height="8.5" fill="#F25022" />
      <rect x="12.5" y="3" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="3" y="12.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  ),
  Adobe: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="4" fill="#FA0F00" />
      <path d="M14.8 4H20v16l-5.2-16ZM9.2 4H4v16L9.2 4ZM12 11.2l3 7.8h-2.1l-.9-2.5h-2l-.9 2.5H7l3-7.8h2Z" fill="#FFFFFF" />
    </svg>
  ),
  Dropbox: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="m6 4 6 4-6 4-6-4 6-4Zm12 0 6 4-6 4-6-4 6-4ZM0 12l6 4 6-4-6-4-6 4Zm18 0 6-4-6-4-6 4 6 4Zm-6 4.7-6-4-6 4 6 4.3 6-4.3Zm0 0 6-4 6 4-6 4.3-6-4.3Z" fill="#0061FF" />
    </svg>
  ),
  AWS: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="4" fill="#232F3E" />
      <path
        d="M6.5 14.5c2.8 1.8 7.2 1.8 10 0 .3-.2.7.1.4.4-3.2 2.2-7.8 2.2-10.8 0-.3-.3.1-.6.4-.4Z"
        fill="#FF9900"
      />
      <path d="M17.2 13.8c.4.3.8.8.7 1.3-.1.5-.7.5-1 .3l.3-1.6Z" fill="#FF9900" />
      <text x="5" y="11.5" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="system-ui">
        aws
      </text>
    </svg>
  ),
  Datadog: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="5" fill="#632CA6" />
      <path
        d="M6 7.5c0-.8.7-1.5 1.5-1.5h9c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 6 13.5v-6Zm2 1.5h8v4.5H8V9Z"
        fill="#FFFFFF"
      />
      <circle cx="12" cy="18" r="1.5" fill="#FFFFFF" />
    </svg>
  ),
  Jira: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="5" fill="#0052CC" />
      <path d="M12 4.5l-5 5h10l-5-5Zm0 15l5-5H7l5 5Zm0-7.5l2.5 2.5 2.5-2.5-2.5-2.5-2.5 2.5Z" fill="#FFFFFF" />
    </svg>
  ),
  Salesforce: ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="5" fill="#00A1E0" />
      <path
        d="M9 8.5a3 3 0 0 1 5.3-1.5 3.5 3.5 0 0 1 4.2 4.2A3 3 0 0 1 17 17H7.5A3.5 3.5 0 0 1 6 10.5 3.5 3.5 0 0 1 9 8.5Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
};
