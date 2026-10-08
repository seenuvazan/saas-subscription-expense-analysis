import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Shield, CheckCircle2, ArrowRight, Play, X, Mail, Lock, Eye, EyeOff,
  Sparkles, Bot, Key, Cpu, Terminal, ChevronRight, Globe, ArrowUp,
  Building2, Check, RefreshCw, AlertCircle, Laptop, Layers, Activity,
  ExternalLink, BarChart3, TrendingDown, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── BRAND LOGOS & ICONS ───────────────────────────────────────────────────────
const SaaSOptimaLogo = ({ className = 'w-9 h-9' }) => (
  <div
    className={`${className} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/25`}
    style={{ background: '#2563EB' }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.65" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.65" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
    </svg>
  </div>
);

// High-fidelity brand SVGs for badges and tickers
const Logos = {
  Slack: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-slate-900">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  Jira: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="jira-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0052CC"/>
          <stop offset="100%" stopColor="#2684FF"/>
        </linearGradient>
      </defs>
      <path d="M11.53 2c0 5.24-4.24 9.48-9.48 9.48a9.47 9.47 0 0 1 4.74-8.21A9.45 9.45 0 0 1 11.53 2z" fill="url(#jira-grad)"/>
      <path d="M12.47 12.52c0-5.24 4.24-9.48 9.48-9.48a9.47 9.47 0 0 1-4.74 8.21 9.45 9.45 0 0 1-4.74 1.27z" fill="url(#jira-grad)"/>
      <path d="M12 22a9.48 9.48 0 0 1-9.48-9.48c5.24 0 9.48 4.24 9.48 9.48z" fill="#0052CC"/>
    </svg>
  ),
  GoogleWorkspace: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
  ),
  Microsoft365: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <rect x="1" y="1" width="10" height="10" rx="1.5" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" rx="1.5" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" rx="1.5" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" rx="1.5" fill="#FFB900"/>
    </svg>
  ),
  Dropbox: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#0061FE]">
      <path d="M6 3.5l6 3.9-6 3.9-6-3.9 6-3.9zm12 0l6 3.9-6 3.9-6-3.9 6-3.9zm-12 7.8l6 3.9-6 3.9-6-3.9 6-3.9zm12 0l6 3.9-6 3.9-6-3.9 6-3.9zm-6 8.5l6-3.9 6 3.9-6 3.9-6-3.9z"/>
    </svg>
  ),
  ServiceNow: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <circle cx="12" cy="12" r="10" fill="#81B5A1" fillOpacity="0.2"/>
      <circle cx="12" cy="12" r="6" fill="#032D42"/>
      <circle cx="12" cy="12" r="3" fill="#81B5A1"/>
    </svg>
  ),
  AWS: () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path d="M7.4 9.6v1.2c-.7-.4-1.5-.6-2.4-.6-1.5 0-2.5.8-2.5 2.1 0 1.2.9 2 2.4 2 .8 0 1.7-.2 2.5-.6v1.1c-.8.4-1.8.6-2.8.6-2.2 0-3.6-1.3-3.6-3.1 0-1.9 1.5-3.2 3.8-3.2.9 0 1.8.2 2.6.5zm5.5-2.8l2.6 8.5h-1.5l-.6-2.1H10.8l-.6 2.1H8.8l2.7-8.5h1.4zm-.2 5.3l-.9-3.2-.9 3.2h1.8zm10.3 3.2h-1.4l-1.6-6.1-1.7 6.1h-1.4l-2.1-8.5h1.4l1.4 6.2 1.7-6.2h1.4l1.6 6.2 1.4-6.2H24l-2.2 8.5z" fill="#232F3E"/>
      <path d="M4.3 19.4c5.8 3.2 13.8 2.2 17.7-.6.3-.2.6.1.4.3-4.2 3.6-12.7 4.5-18.4 1-.4-.2-.1-.9.3-.7z" fill="#FF9900"/>
    </svg>
  ),
  Copilot: () => (
    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
      <Bot className="w-5 h-5" />
    </div>
  ),
  OpenAI: () => (
    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
      <Cpu className="w-5 h-5" />
    </div>
  ),
  Cursor: () => (
    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
      <Terminal className="w-5 h-5" />
    </div>
  ),
  Claude: () => (
    <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
      <Sparkles className="w-5 h-5" />
    </div>
  )
};

// ── SSO MODAL ────────────────────────────────────────────────────────────────
const SSOModal = ({ onClose, onSelect }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-fade-in" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900">
          Sign in with your organization
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Choose your identity provider to sign in using your company credentials.
      </p>
      <div className="space-y-2">
        {[
          { name: 'Microsoft Entra ID', icon: '▦', desc: 'Azure AD / Microsoft 365' },
          { name: 'Google Workspace', icon: 'G', desc: 'GSuite accounts' },
          { name: 'Okta', icon: '○', desc: 'Okta Identity Cloud' },
          { name: 'SAML SSO', icon: '⚿', desc: 'Custom SAML 2.0 provider' },
        ].map(provider => (
          <button
            key={provider.name}
            onClick={() => onSelect(provider.name)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 transition-all text-left hover:border-blue-600 hover:bg-slate-50"
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 bg-blue-50 text-blue-600"
            >
              {provider.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{provider.name}</p>
              <p className="text-xs text-slate-500">{provider.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ── DEMO VIDEO MODAL ──────────────────────────────────────────────────────────
const DemoVideoModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
    <div className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-sm font-medium text-slate-300 ml-2">SaaSOptima Interactive Product Tour (2 min)</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            See SaaSOptima in Action
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            In this 2-minute walkthrough, watch how SaaSOptima hooks into your identity providers, ERP, and payment gateways to uncover ₹12.5L in duplicate software licenses and automate renewal negotiations.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 text-left border-t border-slate-800/80">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400">Step 1</p>
              <p className="text-sm font-semibold text-white mt-1">Connect IDP in 60s</p>
              <p className="text-xs text-slate-400 mt-0.5">Google / Okta / Azure AD</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400">Step 2</p>
              <p className="text-sm font-semibold text-white mt-1">Detect Dormant Seats</p>
              <p className="text-xs text-slate-400 mt-0.5">Filter by 60+ days idle</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400">Step 3</p>
              <p className="text-sm font-semibold text-white mt-1">Reclaim Spend</p>
              <p className="text-xs text-slate-400 mt-0.5">Auto de-provision & save</p>
            </div>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/25"
            >
              Continue to Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── MAIN LANDING PAGE COMPONENT ──────────────────────────────────────────────
export default function LandingPage({ onLoginSuccess, initialMode = 'landing' }) {
  const { login } = useAuth();

  // Navigation & Modals
  const [showLoginModal, setShowLoginModal] = useState(initialMode === 'login');
  const [showSSOModal, setShowSSOModal]     = useState(false);
  const [showDemoModal, setShowDemoModal]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [loginError, setLoginError]     = useState(null);

  // Lead Gen Signup Form states
  const [signupName, setSignupName]       = useState('');
  const [signupEmail, setSignupEmail]     = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreedTerms, setAgreedTerms]     = useState(true);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Scroll tracking for Section 4 fan-out
  const scrollSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollSectionRef,
    offset: ['start end', 'center center'],
  });

  // Dynamic Dispersal Trajectories (controlled via useTransform(scrollYProgress, [0, 0.6], ...))
  // Left Trajectory (Slack, GitHub, Jira): outward left (-160 to -300), upward (-60 to -140), rotate -12deg
  const slackX = useTransform(scrollYProgress, [0, 0.6], [0, -260]);
  const slackY = useTransform(scrollYProgress, [0, 0.6], [0, -110]);
  const slackRotate = useTransform(scrollYProgress, [0, 0.6], [0, -12]);

  const githubX = useTransform(scrollYProgress, [0, 0.6], [0, -310]);
  const githubY = useTransform(scrollYProgress, [0, 0.6], [0, -30]);
  const githubRotate = useTransform(scrollYProgress, [0, 0.6], [0, -8]);

  const jiraX = useTransform(scrollYProgress, [0, 0.6], [0, -200]);
  const jiraY = useTransform(scrollYProgress, [0, 0.6], [0, 70]);
  const jiraRotate = useTransform(scrollYProgress, [0, 0.6], [0, -14]);

  // Center Trajectory (Google Workspace, Dropbox): float straight upward (-120 to -200), scale 0.9 -> 1.08
  const googleY = useTransform(scrollYProgress, [0, 0.6], [0, -180]);
  const googleScale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1.08]);

  const dropboxY = useTransform(scrollYProgress, [0, 0.6], [0, -220]);
  const dropboxScale = useTransform(scrollYProgress, [0, 0.6], [0.92, 1.06]);

  // Right Trajectory (ServiceNow, AWS, Microsoft 365): outward right (+160 to +300), upward (-60 to -140), rotate +12deg
  const msX = useTransform(scrollYProgress, [0, 0.6], [0, 260]);
  const msY = useTransform(scrollYProgress, [0, 0.6], [0, -110]);
  const msRotate = useTransform(scrollYProgress, [0, 0.6], [0, 12]);

  const awsX = useTransform(scrollYProgress, [0, 0.6], [0, 310]);
  const awsY = useTransform(scrollYProgress, [0, 0.6], [0, -30]);
  const awsRotate = useTransform(scrollYProgress, [0, 0.6], [0, 8]);

  const serviceNowX = useTransform(scrollYProgress, [0, 0.6], [0, 200]);
  const serviceNowY = useTransform(scrollYProgress, [0, 0.6], [0, 70]);
  const serviceNowRotate = useTransform(scrollYProgress, [0, 0.6], [0, 14]);

  // Back to top floating button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Login handler
  const performLogin = async (targetEmail, targetPassword, isAdmin = false) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const roleHint = isAdmin ? 'ROLE_ADMIN' : 'ROLE_EMPLOYEE';
      const res = await login(targetEmail, targetPassword, roleHint);
      if (res?.success && onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setLoginError('Please enter your work email.');
      return;
    }
    if (!password) {
      setLoginError('Please enter your password.');
      return;
    }
    const isAdmin = email.includes('priya') || email.includes('finance') || email.includes('admin');
    performLogin(email, password, isAdmin);
  };

  const handleDemoLogin = (type) => {
    const isAdmin = type === 'admin';
    const demoEmail = isAdmin ? 'priya.sharma@techvance.in' : 'arjun.mehta@techvance.in';
    const demoPass  = isAdmin ? 'admin123' : 'password123';
    performLogin(demoEmail, demoPass, isAdmin);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupEmail) return;
    setSignupLoading(true);
    // Instant trial provision simulation
    setTimeout(() => {
      setSignupLoading(false);
      setSignupSuccess(true);
      // Auto login into demo employee account
      setTimeout(() => {
        performLogin(signupEmail, 'password123', false);
      }, 900);
    }, 1000);
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════════
          1. STICKY NAVIGATION BAR & HEADER
          ═══════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-slate-200/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Left */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={scrollToHero}>
            <SaaSOptimaLogo />
            <span className="text-xl font-bold tracking-tight text-slate-900" style={{ letterSpacing: '-0.02em' }}>
              SaaSOptima
            </span>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#overview" className="hover:text-blue-600 transition-colors">Overview</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#integrations" className="hover:text-blue-600 transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#ai-governance" className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Governance
            </a>
            <a href="#docs" className="hover:text-blue-600 transition-colors">Documentation</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('free-trial-card');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setShowLoginModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Start 30-Day Free Trial
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════════
          2. CENTERED LOGIN MODAL / DYNAMIC VIEW
          ═══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Background image & dark blur backdrop */}
            <div
              className="fixed inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`,
              }}
            />
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            />

            {/* Centered elevated floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative z-10 mx-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Brand Header */}
              <div className="flex items-center gap-2.5 mb-5">
                <SaaSOptimaLogo className="w-8 h-8" />
                <span className="text-lg font-bold tracking-tight text-slate-900">SaaSOptima</span>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Take control of every<br />SaaS rupee.
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Track subscriptions, renewals, usage and software spend across your organization.
                </p>
              </div>

              {/* Error Alert */}
              {loginError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs bg-red-50 border border-red-200 text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setLoginError(null); }}
                      placeholder="you@company.in"
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => alert('Password reset link sent to your registered work email.')}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setLoginError(null); }}
                      placeholder="••••••••"
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('employee')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Logos.GoogleWorkspace />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('employee')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Logos.Microsoft365 />
                  <span>Microsoft</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowSSOModal(true)}
                className="w-full text-center text-xs py-1.5 text-slate-500 hover:text-blue-600 transition-colors font-medium flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                Use company SSO
              </button>

              {/* Quick Demo Credentials for Reviewers */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[10px] text-center text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                  ⚡ Quick Demo Accounts
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('employee')}
                    className="py-1 px-2 rounded-lg text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all truncate border border-blue-200/50"
                  >
                    Arjun Mehta (Employee)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="py-1 px-2 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all truncate border border-emerald-200/50"
                  >
                    Priya Sharma (Admin)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SSO Modal */}
      {showSSOModal && (
        <SSOModal
          onClose={() => setShowSSOModal(false)}
          onSelect={(prov) => {
            setShowSSOModal(false);
            handleDemoLogin('employee');
          }}
        />
      )}

      {/* Demo Video Modal */}
      {showDemoModal && (
        <DemoVideoModal onClose={() => setShowDemoModal(false)} />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          3. HERO SECTION (SPLIT 2-COLUMN HIGH-CONVERTING LAYOUT)
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        
        {/* Subtle decorative radial gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Value Proposition) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 tracking-wide">
                ✨ SaaS Spend & License Intelligence Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Stop wasting money on{' '}
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
                software you don't even use.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Unused seats, dormant licenses, duplicate applications, and auto-renewals quietly bleed IT budgets every quarter. SaaSOptima reveals your entire software estate instantly.
            </p>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('free-trial-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
              >
                <span>Deploy Free Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3.5 rounded-xl font-semibold flex items-center gap-2.5 text-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch 2-Minute Demo</span>
              </button>
            </div>

            {/* Trust Metrics Pill Strip */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SOC2 Type II & ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Agent Installation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Average 28% spend reclaimed</span>
              </div>
            </div>
          </div>

          {/* Right Column (Lead Gen Signup Card) */}
          <div className="lg:col-span-5" id="free-trial-card">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-8 relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Start your 30-day free trial
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  No credit card required. Full enterprise features enabled.
                </p>
              </div>

              {signupSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Welcome to SaaSOptima!</h4>
                  <p className="text-xs text-slate-500">
                    Signing you into your sandbox workspace now...
                  </p>
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
                </div>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      placeholder="priya@company.in"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Create Password
                    </label>
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                  </div>

                  {/* Compliance Check */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="compliance-check"
                      checked={agreedTerms}
                      onChange={e => setAgreedTerms(e.target.checked)}
                      required
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="compliance-check" className="text-[11px] text-slate-500 leading-tight">
                      I agree to the Terms of Service and Privacy Policy. Data localized for Indian/Global compliance.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-600/25 text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                  >
                    {signupLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Provisioning Sandbox…</span>
                      </>
                    ) : (
                      <span>GET STARTED FOR FREE</span>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500 pt-1">
                    Have an account already?{' '}
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(true)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          4. INTERACTIVE PREVIEW WITH DYNAMIC SCROLL FAN-OUT ANIMATION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        ref={scrollSectionRef}
        className="relative py-24 sm:py-32 bg-slate-900 text-white overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Unified SaaS Observability
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            Connect every application. Discover every rupee.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Scroll down to see our real-time API integrations fan out across your enterprise stack.
          </p>
        </div>

        {/* Mockup & Fan-Out Badge Arena */}
        <div className="max-w-5xl mx-auto px-6 relative flex items-center justify-center min-h-[480px]">
          
          {/* ── 8 DYNAMIC INTEGRATION BADGES (SCROLL-DRIVEN DISPERSAL) ─────────── */}
          {/* Badge 1: Slack (Left Trajectory) */}
          <motion.div
            style={{ x: slackX, y: slackY, rotate: slackRotate }}
            className="absolute z-20 will-change-transform pointer-events-none"
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.Slack />
            </motion.div>
          </motion.div>

          {/* Badge 2: GitHub (Left Trajectory) */}
          <motion.div
            style={{ x: githubX, y: githubY, rotate: githubRotate }}
            className="absolute z-20 will-change-transform pointer-events-none"
          >
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.GitHub />
            </motion.div>
          </motion.div>

          {/* Badge 3: Jira (Left Trajectory) */}
          <motion.div
            style={{ x: jiraX, y: jiraY, rotate: jiraRotate }}
            className="absolute z-20 will-change-transform pointer-events-none"
          >
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 4.6, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.Jira />
            </motion.div>
          </motion.div>

          {/* Badge 4: Google Workspace (Center Trajectory - Float Upward) */}
          <motion.div
            style={{ y: googleY, scale: googleScale }}
            className="absolute z-20 will-change-transform pointer-events-none -ml-28 md:-ml-32"
          >
            <motion.div
              animate={{ y: [-5, 3, -5] }}
              transition={{ repeat: Infinity, duration: 4.0, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.GoogleWorkspace />
            </motion.div>
          </motion.div>

          {/* Badge 5: Dropbox (Center Trajectory - Float Upward) */}
          <motion.div
            style={{ y: dropboxY, scale: dropboxScale }}
            className="absolute z-20 will-change-transform pointer-events-none ml-28 md:ml-32"
          >
            <motion.div
              animate={{ y: [3, -5, 3] }}
              transition={{ repeat: Infinity, duration: 4.4, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.Dropbox />
            </motion.div>
          </motion.div>

          {/* Badge 6: Microsoft 365 (Right Trajectory) */}
          <motion.div
            style={{ x: msX, y: msY, rotate: msRotate }}
            className="absolute z-20 will-change-transform pointer-events-none"
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3.9, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.Microsoft365 />
            </motion.div>
          </motion.div>

          {/* Badge 7: AWS (Right Trajectory) */}
          <motion.div
            style={{ x: awsX, y: awsY, rotate: awsRotate }}
            className="absolute z-20 will-change-transform pointer-events-none"
          >
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ repeat: Infinity, duration: 4.3, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.AWS />
            </motion.div>
          </motion.div>

          {/* Badge 8: ServiceNow (Right Trajectory) */}
          <motion.div
            style={{ x: serviceNowX, y: serviceNowY, rotate: serviceNowRotate }}
            className="absolute z-20 will-change-transform pointer-events-none"
          >
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 4.1, ease: 'easeInOut' }}
              className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-center w-14 h-14 md:w-16 md:h-16"
            >
              <Logos.ServiceNow />
            </motion.div>
          </motion.div>

          {/* ── CENTERPIECE MOCKUP (16:9 Stylized Dashboard) ───────────────────── */}
          <div className="w-full max-w-4xl aspect-video rounded-3xl shadow-2xl border border-slate-700/80 bg-slate-900/95 overflow-hidden relative group">
            
            {/* Top Mac Bar */}
            <div className="h-10 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="text-xs text-slate-400 font-mono ml-3">
                  saasoptima.internal/spend-analytics
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE SPEND FEED
                </span>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Stat Chips */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                  <p className="text-[11px] text-slate-400">Total SaaS Spend</p>
                  <p className="text-lg md:text-xl font-bold text-white mt-0.5">₹48,20,000</p>
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> -14% vs Q2
                  </p>
                </div>
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                  <p className="text-[11px] text-slate-400">Active Licenses</p>
                  <p className="text-lg md:text-xl font-bold text-white mt-0.5">142 Apps</p>
                  <p className="text-[10px] text-slate-400 mt-1">across 680 seats</p>
                </div>
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                  <p className="text-[11px] text-amber-400">Identified Waste</p>
                  <p className="text-lg md:text-xl font-bold text-amber-300 mt-0.5">₹7,45,000</p>
                  <p className="text-[10px] text-amber-400/80 mt-1">48 idle & duplicate</p>
                </div>
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                  <p className="text-[11px] text-blue-400">AI Model Spend</p>
                  <p className="text-lg md:text-xl font-bold text-blue-300 mt-0.5">₹3,12,000</p>
                  <p className="text-[10px] text-blue-400/80 mt-1">Claude, OpenAI, Cursor</p>
                </div>
              </div>

              {/* Graphic Chart representation */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-left">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span>Quarterly License Utilization Heatmap</span>
                  <span className="text-blue-400">Automated Policy Enforcement: Active</span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full w-[54%]" title="Active Utilization" />
                    <div className="bg-amber-500 h-full w-[22%]" title="Dormant Licenses" />
                    <div className="bg-red-500 h-full w-[24%]" title="Unassigned / Waste" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>54% Highly Active (Engineering & Sales)</span>
                    <span>22% Idle &gt; 45 Days</span>
                    <span>24% Unused / Candidate for Deprovisioning</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Play Button Centered */}
            <div
              onClick={() => setShowDemoModal(true)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-colors group-hover:bg-slate-950/30"
            >
              <div className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 transition-all border border-white/20">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </div>

          </div>
        </div>

        {/* ── AVAILABLE INTEGRATIONS TICKER ───────────────────────────────────── */}
        <div id="integrations" className="mt-20 pt-10 border-t border-slate-800">
          <p className="text-center text-xs uppercase tracking-widest text-slate-400 font-semibold mb-8">
            Available Integrations
          </p>
          <div className="w-full overflow-hidden relative">
            <div className="animate-infinite-ticker flex items-center gap-14 text-slate-400 text-sm font-semibold">
              {[
                'Okta Identity Cloud', 'Zoom Video Communications', 'Salesforce CRM', 'Zoho Enterprise',
                'Claude / Anthropic', 'Dropbox Business', 'GitHub Enterprise', 'Slack Technologies',
                'Okta Identity Cloud', 'Zoom Video Communications', 'Salesforce CRM', 'Zoho Enterprise',
                'Claude / Anthropic', 'Dropbox Business', 'GitHub Enterprise', 'Slack Technologies'
              ].map((brand, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          5. "SHADOW AI & TOOL GOVERNANCE" FEATURE GRID (DARK CONTRAST SECTION)
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="ai-governance"
        className="bg-slate-950 text-white py-24 px-6 border-y border-slate-800 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              Shadow AI Discovery
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              AI tools are the new shadow IT.<br />Now you can see all of them.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Claude. Cursor. GitHub Copilot. OpenAI API. Track every seat, token, and dollar your team spends on AI models directly inside SaaSOptima.
            </p>
          </div>

          {/* 4-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-14">
            
            {/* Card 1: GitHub Copilot */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Logos.Copilot />
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Per-seat tracking
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">GitHub Copilot</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track seat assignments, dormant licenses, adoption rates, and model-level spend across your engineering organization.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Dormant license alerts</span>
                <span className="text-purple-400 font-mono font-semibold">Active</span>
              </div>
            </div>

            {/* Card 2: OpenAI API */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Logos.OpenAI />
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Per-key monitoring
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">OpenAI API</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Monitor spend by user, project, and API key across every model your developer team leverages.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Token rate limit caps</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
            </div>

            {/* Card 3: Cursor */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Logos.Cursor />
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Model cost breakdown
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cursor</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  See per-user spend, seat utilization, and token costs across your engineering team in real time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Team license reclaims</span>
                <span className="text-blue-400 font-mono font-semibold">Active</span>
              </div>
            </div>

            {/* Card 4: Claude */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Logos.Claude />
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Workspace-level usage
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Claude</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track API and workspace usage by department, including Claude Code activity, seat allocation, and monthly billing caps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Departmental spend caps</span>
                <span className="text-amber-400 font-mono font-semibold">Active</span>
              </div>
            </div>

          </div>

          {/* Action CTA Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                const el = document.getElementById('free-trial-card');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setShowLoginModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 inline-flex items-center gap-2 text-sm"
            >
              <span>Connect your AI tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          6. ENTERPRISE FOOTER & NAVIGATION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer id="pricing" className="bg-slate-900 text-slate-400 border-t border-slate-800">
        
        {/* Top 4-Column Layout */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <SaaSOptimaLogo />
              <span className="text-lg font-bold text-white tracking-tight">SaaSOptima</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent SaaS spend and license management built for modern enterprises. Reveal dormant licenses, automate renewals, and control cloud software spend.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors" aria-label="Twitter">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors" aria-label="LinkedIn">
                <Laptop className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white transition-colors" aria-label="GitHub">
                <Terminal className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-300">Quick Links</p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">Get Started</a>
              </li>
              <li>
                <button onClick={() => setShowDemoModal(true)} className="hover:text-white transition-colors text-left">
                  Request Demo
                </button>
              </li>
              <li>
                <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing & Plans</a>
              </li>
              <li>
                <a href="mailto:sales@saasoptima.in" className="hover:text-white transition-colors">Contact Sales</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-300">Resources</p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">What's New in v2.4</a>
              </li>
              <li>
                <a href="#docs" className="hover:text-white transition-colors">API Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">ROI Calculator</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Security Whitepaper</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-300">Company</p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Careers (Hiring!)</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Customer Stories</a>
              </li>
              <li>
                <a href="mailto:support@saasoptima.in" className="hover:text-white transition-colors">Contact Support</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Trust & Compliance Center</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-6 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 SaaSOptima Technologies. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Security & Compliance</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>

      </footer>

      {/* Floating Back-To-Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
