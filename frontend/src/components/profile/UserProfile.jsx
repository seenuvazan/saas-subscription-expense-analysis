import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileAPI, userAPI } from '../../services/api';
import { DEPARTMENTS } from '../../utils/constants';
import {
  User, Mail, Phone, Calendar, MapPin, Briefcase,
  Lock, Save, X, Edit3, Camera, Shield, AlertCircle,
  KeyRound, Check, Sparkles, Building
} from 'lucide-react';

const AVATAR_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EC4899', '#06B6D4', '#6366F1', '#14B8A6'
];

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

function calculatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: 'Too short', color: '#9CA3AF' };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--danger)' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'var(--warning)' };
  if (score === 3) return { score: 3, label: 'Good', color: '#3B82F6' };
  return { score: 4, label: 'Strong', color: 'var(--success)' };
}

const UserProfile = ({ targetUserId = null, onBack, showToast }) => {
  const { user: currentUser, updateUser } = useAuth();
  const isEditingOtherUser = Boolean(targetUserId && targetUserId !== currentUser?.id);
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  // Profile data state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    jobTitle: '',
    department: 'ENGINEERING',
    employeeId: '',
    location: '',
    bio: '',
    avatarUrl: '',
    role: 'ROLE_EMPLOYEE',
  });

  const [initialProfile, setInitialProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef(null);

  // Password section state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  // Fetch profile on mount or target change
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        let res;
        if (isEditingOtherUser) {
          res = await userAPI.getById(targetUserId);
        } else {
          res = await profileAPI.getMe();
        }
        if (res.data) {
          const data = {
            firstName: res.data.firstName || '',
            lastName: res.data.lastName || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            dateOfBirth: res.data.dateOfBirth || '',
            gender: res.data.gender || '',
            jobTitle: res.data.jobTitle || '',
            department: res.data.department || 'ENGINEERING',
            employeeId: res.data.employeeId || '',
            location: res.data.location || '',
            bio: res.data.bio || '',
            avatarUrl: res.data.avatarUrl || '',
            role: res.data.role || 'ROLE_EMPLOYEE',
          };
          setProfile(data);
          setInitialProfile(data);
        }
      } catch (err) {
        // Fallback to active user context if offline
        if (!isEditingOtherUser && currentUser) {
          const [first, ...rest] = (currentUser.fullName || '').split(' ');
          const data = {
            firstName: currentUser.firstName || first || 'Alex',
            lastName: currentUser.lastName || rest.join(' ') || 'Morgan',
            email: currentUser.email || '',
            phone: currentUser.phone || '+1 (555) 234-5678',
            dateOfBirth: currentUser.dateOfBirth || '1992-04-15',
            gender: currentUser.gender || 'MALE',
            jobTitle: currentUser.jobTitle || 'Engineering Lead',
            department: currentUser.department || 'ENGINEERING',
            employeeId: currentUser.employeeId || 'EMP-1042',
            location: currentUser.location || 'San Francisco, CA',
            bio: currentUser.bio || 'Leading core cloud infrastructure and software architecture.',
            avatarUrl: currentUser.avatarUrl || '',
            role: currentUser.role || 'ROLE_EMPLOYEE',
          };
          setProfile(data);
          setInitialProfile(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [targetUserId, isEditingOtherUser, currentUser]);

  // Track unsaved changes
  useEffect(() => {
    const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    setHasUnsavedChanges(isDirty);

    const handleBeforeUnload = (e) => {
      if (isDirty && isEditing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [profile, initialProfile, isEditing]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Avatar upload
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors(prev => ({ ...prev, avatar: 'Avatar image must be smaller than 2 MB' }));
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setFieldErrors(prev => ({ ...prev, avatar: 'Only PNG, JPEG, or WebP images are allowed' }));
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64Url = uploadEvent.target.result;
        setProfile(prev => ({ ...prev, avatarUrl: base64Url }));

        if (!isEditingOtherUser) {
          const formData = new FormData();
          formData.append('file', file);
          try {
            await profileAPI.uploadAvatar(formData);
            updateUser({ avatarUrl: base64Url });
            if (showToast) showToast('Avatar updated successfully!');
          } catch {
            updateUser({ avatarUrl: base64Url });
          }
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setFieldErrors(prev => ({ ...prev, avatar: 'Failed to process image file' }));
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!profile.firstName || profile.firstName.trim().length < 2 || profile.firstName.trim().length > 50) {
      errors.firstName = 'First name must be between 2 and 50 characters';
    }
    if (!profile.lastName || profile.lastName.trim().length < 2 || profile.lastName.trim().length > 50) {
      errors.lastName = 'Last name must be between 2 and 50 characters';
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    if (!profile.email || !emailRegex.test(profile.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (profile.phone && profile.phone.trim()) {
      const phoneRegex = /^[+0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(profile.phone.trim())) {
        errors.phone = 'Please enter a valid phone number (e.g. +1 555-123-4567)';
      }
    }

    if (profile.dateOfBirth) {
      const dob = new Date(profile.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        errors.dateOfBirth = 'Date of birth must be in the past';
      } else {
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 16) {
          errors.dateOfBirth = 'User must be at least 16 years old';
        }
      }
    }

    if (profile.bio && profile.bio.length > 250) {
      errors.bio = `Bio cannot exceed 250 characters (${profile.bio.length}/250)`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setFieldErrors({});

    try {
      let res;
      if (isEditingOtherUser) {
        res = await userAPI.update(targetUserId, profile);
      } else {
        res = await profileAPI.updateMe(profile);
        updateUser(res.data || profile);
      }

      const updated = res.data || profile;
      setProfile(updated);
      setInitialProfile(updated);
      setIsEditing(false);
      setHasUnsavedChanges(false);

      if (showToast) {
        showToast('Profile saved successfully!');
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === 'object') {
        setFieldErrors(serverErrors);
      } else {
        const msg = err.response?.data?.message || 'Failed to save profile. Saved locally.';
        // Apply locally in demo mode
        if (!isEditingOtherUser) {
          updateUser(profile);
          setInitialProfile(profile);
          setIsEditing(false);
        }
        if (showToast) showToast(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Discard them?')) {
        return;
      }
    }
    setProfile(initialProfile);
    setFieldErrors({});
    setIsEditing(false);
  };

  // Password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setSavingPassword(true);
    setPasswordErrors({});

    try {
      await profileAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      if (showToast) showToast('Password updated successfully!');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setPasswordErrors(serverErrors);
      } else {
        setPasswordErrors({ currentPassword: err.response?.data?.message || 'Failed to update password' });
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'User Profile';
  const initials = (profile.firstName?.[0] || profile.lastName?.[0] || 'U').toUpperCase();
  const strength = calculatePasswordStrength(passwordData.newPassword);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

      {/* Top Header Card */}
      <div
        className="rounded-2xl border p-6 shadow-sm relative overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">

          {/* Avatar & Title Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 shadow-md"
                  style={{ borderColor: 'var(--accent)' }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-md"
                  style={{ background: 'var(--accent)' }}
                >
                  {initials}
                </div>
              )}

              {/* Upload photo button */}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Upload profile picture (Max 2MB)"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span>Change</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleAvatarFile}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  {fullName}
                </h1>
                <span
                  className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: profile.role === 'ROLE_ADMIN' ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: profile.role === 'ROLE_ADMIN' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {profile.role === 'ROLE_ADMIN' ? 'Finance Admin' : 'Employee'}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                >
                  {profile.department}
                </span>
              </div>

              <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                {profile.jobTitle || 'Team Member'} {profile.employeeId && `· ${profile.employeeId}`}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </span>
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Back to Team
              </button>
            )}

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                id="edit-profile-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
                style={{ background: 'var(--accent)' }}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  id="save-profile-btn"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm disabled:opacity-60"
                  style={{ background: 'var(--accent)' }}
                >
                  <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global error banner if any */}
        {fieldErrors.avatar && (
          <div className="mt-4 p-3 rounded-xl text-xs flex items-center gap-2" style={{ background: '#EF444415', color: 'var(--danger)' }}>
            <AlertCircle className="w-4 h-4" />
            <span>{fieldErrors.avatar}</span>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <div className="space-y-6">

        {/* 1. Personal Information */}
        <section
          className="rounded-2xl border p-6 shadow-sm"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <User className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                First Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: fieldErrors.firstName ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{fieldErrors.firstName}</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {profile.firstName || '—'}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Last Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    placeholder="e.g. Morgan"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: fieldErrors.lastName ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{fieldErrors.lastName}</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-semibold py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {profile.lastName || '—'}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Date of Birth
              </label>
              {isEditing ? (
                <>
                  <input
                    type="date"
                    value={profile.dateOfBirth || ''}
                    onChange={e => handleChange('dateOfBirth', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: fieldErrors.dateOfBirth ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {fieldErrors.dateOfBirth && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{fieldErrors.dateOfBirth}</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '—'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Gender
              </label>
              {isEditing ? (
                <select
                  value={profile.gender || ''}
                  onChange={e => handleChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select Gender</option>
                  {GENDERS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {GENDERS.find(g => g.value === profile.gender)?.label || profile.gender || '—'}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Phone Number
              </label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: fieldErrors.phone ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{fieldErrors.phone}</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {profile.phone || '—'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Contact Information */}
        <section
          className="rounded-2xl border p-6 shadow-sm"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <Mail className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Work Email <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="user@company.com"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: fieldErrors.email ? 'var(--danger)' : 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{fieldErrors.email}</p>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {profile.email || '—'}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Work Location / City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={e => handleChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              ) : (
                <p className="text-sm font-medium py-1.5" style={{ color: 'var(--text-primary)' }}>
                  {profile.location || '—'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 3. Work Information */}
        <section
          className="rounded-2xl border p-6 shadow-sm"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Work & Organizational Role
              </h2>
            </div>
            {!isAdmin && (
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <Lock className="w-3 h-3" /> Managed by Finance Admin
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Job Title
              </label>
              {isEditing && isAdmin ? (
                <input
                  type="text"
                  value={profile.jobTitle || ''}
                  onChange={e => handleChange('jobTitle', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              ) : (
                <div className="flex items-center gap-2 py-1.5">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {profile.jobTitle || '—'}
                  </p>
                  {!isAdmin && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                </div>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Department
              </label>
              {isEditing && isAdmin ? (
                <select
                  value={profile.department}
                  onChange={e => handleChange('department', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2 py-1.5">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                  >
                    {profile.department}
                  </span>
                  {!isAdmin && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                </div>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Employee ID
              </label>
              <div className="flex items-center gap-2 py-1.5">
                <span className="text-sm font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {profile.employeeId || 'EMP-1042'}
                </span>
                <Lock className="w-3.5 h-3.5 text-gray-400" title="Employee IDs are immutable" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. About & Bio */}
        <section
          className="rounded-2xl border p-6 shadow-sm"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                About & Bio
              </h2>
            </div>
            {isEditing && (
              <span className="text-[11px]" style={{ color: (profile.bio?.length || 0) > 250 ? 'var(--danger)' : 'var(--text-muted)' }}>
                {profile.bio?.length || 0} / 250 characters
              </span>
            )}
          </div>

          <div>
            {isEditing ? (
              <>
                <textarea
                  rows={3}
                  value={profile.bio || ''}
                  onChange={e => handleChange('bio', e.target.value)}
                  placeholder="Tell your team about your responsibilities and tooling expertise…"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none leading-relaxed"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: fieldErrors.bio ? 'var(--danger)' : 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                {fieldErrors.bio && (
                  <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{fieldErrors.bio}</p>
                )}
              </>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {profile.bio || 'No personal bio added yet.'}
              </p>
            )}
          </div>
        </section>

        {/* 5. Change Password Section (Self only) */}
        {!isEditingOtherUser && (
          <section
            className="rounded-2xl border p-6 shadow-sm"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    Security & Password
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Protect your account credentials with BCrypt encryption.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordSection(v => !v)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {showPasswordSection ? 'Hide' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <form onSubmit={handlePasswordSubmit} className="mt-5 pt-4 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: passwordErrors.currentPassword ? 'var(--danger)' : 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: passwordErrors.newPassword ? 'var(--danger)' : 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{passwordErrors.newPassword}</p>
                    )}
                    {/* Password Strength Meter */}
                    {passwordData.newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px]" style={{ color: strength.color }}>
                          <span>Strength:</span>
                          <span className="font-bold">{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${(strength.score / 4) * 100}%`,
                              background: strength.color
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl text-sm border focus:outline-none"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: passwordErrors.confirmPassword ? 'var(--danger)' : 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-[11px] mt-1" style={{ color: 'var(--danger)' }}>{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-60"
                    style={{ background: 'var(--accent)' }}
                  >
                    {savingPassword ? 'Updating Password…' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
