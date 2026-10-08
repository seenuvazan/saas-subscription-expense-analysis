import React from 'react';
import LandingPage from '../landing/LandingPage';

export default function AuthScreen({ onLoginSuccess, initialMode = 'landing' }) {
  return <LandingPage onLoginSuccess={onLoginSuccess} initialMode={initialMode} />;
}
