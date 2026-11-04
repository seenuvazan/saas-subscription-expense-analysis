import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';

/**
 * AuthScreen — routes between login, register, and forgot-password pages.
 * The landing page (LandingPage) is a separate route handled in App.jsx
 * and is shown only when no user is authenticated.
 */
export default function AuthScreen({ onLoginSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  const navigate = (newMode) => setMode(newMode);

  if (mode === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={(user) => onLoginSuccess?.(user)}
        onNavigate={navigate}
      />
    );
  }

  if (mode === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigate={navigate}
      />
    );
  }

  // Default: login
  return (
    <LoginPage
      onLoginSuccess={(user) => onLoginSuccess?.(user)}
      onNavigate={navigate}
    />
  );
}
