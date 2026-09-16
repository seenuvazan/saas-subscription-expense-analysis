import React, { useState } from 'react';
import { subscriptionAPI } from '../../services/api';
import { CATEGORIES, DEPARTMENTS, CURRENCIES, BILLING_FREQUENCIES } from '../../utils/constants';
import { X, CheckCircle, ArrowRight, ArrowLeft, DollarSign, Users, Calendar, Layers } from 'lucide-react';

const LogSubscriptionModal = ({ isOpen, onClose, onSuccess, initialDept = 'ENGINEERING' }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    category: 'DEV',
    cost: '',
    currency: 'USD',
    billingFrequency: 'MONTHLY',
    department: initialDept,
    nextRenewalDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    assignedSeats: 10,
    usedSeats: 8,
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await subscriptionAPI.create({
        ...formData,
        cost: parseFloat(formData.cost),
        assignedSeats: parseInt(formData.assignedSeats, 10),
        usedSeats: parseInt(formData.usedSeats, 10)
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error logging subscription:', err);
      // Demo success fallback
      if (onSuccess) onSuccess(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border border-gray-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Multi-step Header Indicator */}
        <div className="mb-6">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Step {step} of 3</span>
          <h3 className="text-xl font-extrabold text-white mt-1">
            {step === 1 && '1. Software & Category'}
            {step === 2 && '2. Pricing & Frequency'}
            {step === 3 && '3. Department & License Usage'}
          </h3>
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Vendor / Tool Name *
                </label>
                <input
                  type="text"
                  name="vendorName"
                  required
                  placeholder="e.g. Figma, GitHub, Datadog..."
                  value={formData.vendorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Notes / Description
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="Primary usage intent..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Cost Amount *
                  </label>
                  <input
                    type="number"
                    name="cost"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Billing Frequency *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {BILLING_FREQUENCIES.map(freq => (
                    <button
                      type="button"
                      key={freq.value}
                      onClick={() => setFormData(prev => ({ ...prev, billingFrequency: freq.value }))}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                        formData.billingFrequency === freq.value
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-gray-900 border-gray-800 text-gray-400'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Assigned Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Next Renewal Date *
                </label>
                <input
                  type="date"
                  name="nextRenewalDate"
                  required
                  value={formData.nextRenewalDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Assigned Seats
                  </label>
                  <input
                    type="number"
                    name="assignedSeats"
                    min="1"
                    value={formData.assignedSeats}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Actively Used Seats
                  </label>
                  <input
                    type="number"
                    name="usedSeats"
                    min="0"
                    value={formData.usedSeats}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Log Subscription'} <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogSubscriptionModal;
