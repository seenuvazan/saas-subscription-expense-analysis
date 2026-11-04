import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Bot, TrendingUp, AlertCircle, Info, ArrowUpRight } from 'lucide-react';
import { USD_TO_INR, formatINRCompact } from '../../utils/formatters';
import VendorLogo from '../common/VendorLogo';

// ── AI vendor identification ──────────────────────────────────────────────────
const AI_VENDOR_KEYWORDS = [
  'openai', 'chatgpt', 'claude', 'anthropic', 'gemini', 'google ai',
  'copilot', 'github copilot', 'cursor', 'perplexity', 'midjourney',
  'dall-e', 'stable diffusion', 'runway', 'synthesia', 'jasper',
  'copy.ai', 'writesonic', 'cohere', 'hugging face', 'replicate',
  'mistral', 'deepseek', 'grok',
];

function isAiVendor(vendorName = '') {
  const lower = vendorName.toLowerCase();
  return AI_VENDOR_KEYWORDS.some(kw => lower.includes(kw));
}

function toMonthlyINR(sub) {
  const usdCost = sub.normalizedMonthlyCostUSD || sub.cost || 0;
  if (sub.currency === 'INR') {
    const freq = sub.billingFrequency?.toUpperCase();
    if (freq === 'ANNUAL' || freq === 'ANNUALLY') return sub.cost / 12;
    if (freq === 'QUARTERLY') return sub.cost / 3;
    return sub.cost;
  }
  return usdCost * USD_TO_INR;
}

// ── Chart tooltip ─────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2.5 text-xs shadow-lg"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', minWidth: 140 }}>
      {label && <p className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center justify-between gap-3" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold text-currency" style={{ color: 'var(--text-primary)' }}>
            {formatINRCompact(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
};

const COLORS = ['#3157D5', '#16865C', '#D97706', '#7C3AED', '#0E7490', '#C2413B', '#059669'];

// ── AI Usage Page ─────────────────────────────────────────────────────────────
export default function AIUsagePage({ subscriptions = [] }) {
  const [comparisonView, setComparisonView] = useState('monthly');

  // Filter to AI subscriptions
  const aiSubs = useMemo(() =>
    subscriptions.filter(s => isAiVendor(s.vendorName)),
    [subscriptions]
  );

  // Totals
  const totalMonthlyINR = useMemo(() =>
    aiSubs.reduce((sum, s) => sum + toMonthlyINR(s), 0),
    [aiSubs]
  );
  const totalAnnualINR = totalMonthlyINR * 12;
  const totalSeats = useMemo(() =>
    aiSubs.reduce((sum, s) => sum + (s.assignedSeats || 0), 0),
    [aiSubs]
  );
  const unusedSeats = useMemo(() =>
    aiSubs.reduce((sum, s) => sum + Math.max(0, (s.assignedSeats || 0) - (s.usedSeats || 0)), 0),
    [aiSubs]
  );

  // Cost comparison chart data
  const comparisonData = useMemo(() => {
    return aiSubs
      .map(s => ({
        name: s.vendorName,
        Monthly: toMonthlyINR(s),
        Annual: toMonthlyINR(s) * 12,
        seats: s.assignedSeats || 0,
        used: s.usedSeats || 0,
        utilization: s.utilizationRate || (s.assignedSeats ? Math.round((s.usedSeats / s.assignedSeats) * 100) : 0),
        status: s.status,
      }))
      .sort((a, b) => b.Monthly - a.Monthly);
  }, [aiSubs]);

  // Donut chart data
  const donutData = useMemo(() =>
    aiSubs.map(s => ({
      name: s.vendorName,
      value: toMonthlyINR(s),
    })).filter(d => d.value > 0),
    [aiSubs]
  );

  const mostExpensive = comparisonData[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">AI Usage &amp; Costs</h2>
        <p className="page-subtitle">
          Track spending across AI tools and subscriptions. API usage metrics require provider integration.
        </p>
      </div>

      {aiSubs.length === 0 ? (
        <div className="card p-12 text-center">
          <Bot className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No AI subscriptions tracked</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Add subscriptions for ChatGPT, Claude, Gemini, Copilot, Cursor, or other AI tools to see spending analysis here.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Monthly AI Spend', value: formatINRCompact(totalMonthlyINR), color: 'var(--accent)' },
              { label: 'Annual AI Spend', value: formatINRCompact(totalAnnualINR), color: 'var(--text-primary)' },
              { label: 'AI Tools Tracked', value: aiSubs.length.toString(), color: 'var(--text-primary)' },
              { label: 'Unused AI Seats', value: unusedSeats.toString(), color: unusedSeats > 0 ? 'var(--warning)' : 'var(--success)' },
            ].map(kpi => (
              <div key={kpi.label} className="card p-4">
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
                <p className="text-2xl font-bold text-currency" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="space-y-2">
            {mostExpensive && (
              <div className="card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-muted)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Highest AI cost: {mostExpensive.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formatINRCompact(mostExpensive.Monthly)}/month ·{' '}
                    {Math.round((mostExpensive.Monthly / totalMonthlyINR) * 100)}% of total AI spend
                  </p>
                </div>
              </div>
            )}
            {unusedSeats > 0 && (
              <div className="card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--warning-muted)' }}>
                  <AlertCircle className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {unusedSeats} unused AI seats detected
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Review license assignments to reduce costs on underutilized AI tools.
                  </p>
                </div>
              </div>
            )}
            <div className="card p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--bg-elevated)' }}>
                <Info className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  API consumption data
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Token usage, cost per request, and model-level breakdown require provider API integration.
                  Connect your OpenAI, Anthropic, or Google AI account to see consumption analytics.
                </p>
              </div>
            </div>
          </div>

          {/* Cost Comparison Chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  AI Tool Cost Comparison
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Subscription cost in INR · manually tracked
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                {[{ k: 'monthly', l: 'Monthly' }, { k: 'annual', l: 'Annual' }].map(opt => (
                  <button key={opt.k} onClick={() => setComparisonView(opt.k)}
                    className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: comparisonView === opt.k ? 'var(--bg-surface)' : 'transparent',
                      color: comparisonView === opt.k ? 'var(--accent)' : 'var(--text-secondary)',
                      boxShadow: comparisonView === opt.k ? 'var(--shadow-xs)' : 'none',
                    }}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="var(--text-muted)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey={comparisonView === 'monthly' ? 'Monthly' : 'Annual'}
                    name={comparisonView === 'monthly' ? 'Monthly Cost' : 'Annual Cost'}
                    radius={[0, 4, 4, 0]}
                  >
                    {comparisonData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detail table + Donut grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spend distribution donut */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Spend Distribution
              </h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="45%"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatINRCompact(val), 'Monthly']}
                      contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', color: 'var(--text-secondary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subscription detail table */}
            <div className="card overflow-hidden lg:col-span-2">
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  AI Subscription Detail
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tool</th>
                      <th>Monthly Cost</th>
                      <th>Seats (Used/Total)</th>
                      <th>Utilization</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map(sub => {
                      const util = sub.seats > 0 ? Math.round((sub.used / sub.seats) * 100) : null;
                      const utilColor = util === null ? 'var(--text-muted)'
                        : util < 50 ? 'var(--danger)'
                        : util < 75 ? 'var(--warning)'
                        : 'var(--success)';
                      return (
                        <tr key={sub.name}>
                          <td>
                            <div className="flex items-center gap-2">
                              <VendorLogo vendorName={sub.name} size="sm" />
                              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {sub.name}
                              </span>
                            </div>
                          </td>
                          <td className="font-semibold text-currency" style={{ color: 'var(--text-primary)' }}>
                            {formatINRCompact(sub.Monthly)}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {sub.seats > 0 ? `${sub.used} / ${sub.seats}` : '—'}
                          </td>
                          <td>
                            {util !== null ? (
                              <span className="text-sm font-semibold" style={{ color: utilColor }}>
                                {util}%
                              </span>
                            ) : '—'}
                          </td>
                          <td>
                            <span
                              className="badge text-xs"
                              style={{
                                background: sub.status === 'ACTIVE' ? 'var(--success-muted)' : 'var(--warning-muted)',
                                color: sub.status === 'ACTIVE' ? 'var(--success)' : 'var(--warning)',
                              }}
                            >
                              {sub.status === 'ACTIVE' ? 'Active' : sub.status?.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* API usage section — honest placeholder */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <Bot className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  API Consumption Analytics
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Token-level usage, cost-per-request, model breakdown, and project-level attribution require
                  direct integration with provider APIs. These metrics are distinct from subscription costs —
                  a paid ChatGPT plan does not imply a specific token consumption amount.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { provider: 'OpenAI', status: 'Connect API key', color: '#10A37F' },
                    { provider: 'Anthropic', status: 'Connect API key', color: '#D4A36B' },
                    { provider: 'Google AI', status: 'Connect service account', color: '#4285F4' },
                  ].map(p => (
                    <div key={p.provider}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.provider}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Usage data unavailable</p>
                      </div>
                      <button
                        className="text-[10px] font-medium px-2 py-1 rounded"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                        disabled
                        title="Provider integration — pending configuration"
                      >
                        {p.status}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
