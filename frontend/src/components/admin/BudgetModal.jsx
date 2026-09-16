import React, { useState } from 'react';
import { budgetAPI } from '../../services/api';
import { DEPARTMENTS } from '../../utils/constants';
import { X, CheckCircle, CreditCard } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    department: 'ENGINEERING',
    monthlyBudgetLimitUSD: '20000',
    warningThresholdPercent: 80,
    criticalThresholdPercent: 100,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await budgetAPI.update({
        department: formData.department,
        monthlyBudgetLimitUSD: parseFloat(formData.monthlyBudgetLimitUSD),
        warningThresholdPercent: parseInt(formData.warningThresholdPercent, 10),
        criticalThresholdPercent: parseInt(formData.criticalThresholdPercent, 10),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error setting budget:', err);
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-3xl p-6 relative border border-gray-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Department Budget Allocation</h3>
            <p className="text-xs text-gray-400">Configure monthly spend caps & alert triggers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Monthly Budget Limit (USD)
            </label>
            <input
              type="number"
              step="100"
              required
              value={formData.monthlyBudgetLimitUSD}
              onChange={(e) => setFormData({ ...formData, monthlyBudgetLimitUSD: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Warning Alert (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={formData.warningThresholdPercent}
                onChange={(e) => setFormData({ ...formData, warningThresholdPercent: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Critical Breach (%)
              </label>
              <input
                type="number"
                min="80"
                max="200"
                value={formData.criticalThresholdPercent}
                onChange={(e) => setFormData({ ...formData, criticalThresholdPercent: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Save Budget Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
