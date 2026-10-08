import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell, PieChart, Pie,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import { USD_TO_INR, formatINRCompact } from '../../utils/formatters';

// Professional palette — calm, B2B appropriate
const COLORS = [
  '#3157D5', '#16865C', '#D97706', '#7C3AED',
  '#0E7490', '#9333EA', '#C2413B', '#059669',
];

// Shared tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2.5 text-xs shadow-lg"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', minWidth: 120 }}
    >
      {label && <p className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center justify-between gap-3" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold text-currency" style={{ color: 'var(--text-primary)' }}>
            {formatINRCompact(entry.value * USD_TO_INR)}
          </span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const total = payload[0]?.payload?.total || 1;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{entry.name}</p>
      <p style={{ color: 'var(--text-secondary)' }}>
        {formatINRCompact(entry.value * USD_TO_INR)}/mo
      </p>
    </div>
  );
};

const CardWrapper = ({ title, subtitle, children }) => (
  <div className="card p-5">
    <div className="mb-4">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

export const DepartmentSpendChart = ({ data = [] }) => {
  const fallback = [
    { department: 'ENGINEERING', actualMonthlySpendUSD: 15150, budgetLimitUSD: 18000 },
    { department: 'DESIGN',      actualMonthlySpendUSD: 3000,  budgetLimitUSD: 4000 },
    { department: 'SALES',       actualMonthlySpendUSD: 2453,  budgetLimitUSD: 3200 },
    { department: 'MARKETING',   actualMonthlySpendUSD: 1400,  budgetLimitUSD: 1300 },
    { department: 'PRODUCT',     actualMonthlySpendUSD: 970,   budgetLimitUSD: 1420 },
  ];
  const source = data.length > 0 ? data : fallback;

  const chartData = source.map(d => ({
    name: d.department.charAt(0) + d.department.slice(1).toLowerCase(),
    Actual: Number(d.actualMonthlySpendUSD || 0),
    Budget: Number(d.budgetLimitUSD || 5000),
  }));

  return (
    <CardWrapper title="Department Spend vs Budget" subtitle="Monthly INR equivalent · current period">
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -5, bottom: 0 }} barSize={14} barGap={4}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${(v * USD_TO_INR / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px', color: 'var(--text-secondary)' }}
            />
            <Bar dataKey="Actual" fill="#3157D5" radius={[3, 3, 0, 0]} name="Actual Spend" />
            <Bar dataKey="Budget" fill="var(--bg-elevated)" radius={[3, 3, 0, 0]} name="Budget Limit"
              stroke="var(--border)" strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
};

export const CategorySpendChart = ({ data = [] }) => {
  const fallback = [
    { category: 'Dev Tools',      monthlySpendUSD: 15150 },
    { category: 'Productivity',   monthlySpendUSD: 7314 },
    { category: 'Design',         monthlySpendUSD: 3000 },
    { category: 'Sales & CRM',    monthlySpendUSD: 2453 },
    { category: 'Marketing',      monthlySpendUSD: 1400 },
  ];
  const source = data.length > 0 ? data : fallback;
  const chartData = source.map(d => ({
    name: d.category,
    value: Number(d.monthlySpendUSD || 0),
  }));
  const total = chartData.reduce((a, b) => a + b.value, 0);

  return (
    <CardWrapper title="Spend by Category" subtitle="Monthly distribution">
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '10px', paddingTop: '8px', color: 'var(--text-secondary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
};

export const MonthlyTrendChart = () => {
  const [range, setRange] = useState('6M');

  // FY2026-27 (April 2026 – March 2027) monthly data in USD (×84.5 = INR)
  const allData = [
    { month: 'Apr 26', Spend: 28500, Wasted: 4500 },
    { month: 'May 26', Spend: 31200, Wasted: 4800 },
    { month: 'Jun 26', Spend: 34000, Wasted: 5100 },
    { month: 'Jul 26', Spend: 36800, Wasted: 4200 },
    { month: 'Aug 26', Spend: 38240, Wasted: 3800 },
    { month: 'Sep 26', Spend: 39040, Wasted: 3390 },
    { month: 'Oct 26', Spend: 29400, Wasted: 3700 }, // current (partial)
  ];

  const displayData = range === '3M' ? allData.slice(-4) : allData;

  return (
    <CardWrapper title="Monthly SaaS Spend Trend" subtitle="INR equivalent · FY 2026–27 (Apr–Mar)">
      <div className="flex items-center justify-end gap-1 mb-3">
        {['3M', '6M'].map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: range === r ? 'var(--accent)' : 'var(--bg-elevated)',
              color: range === r ? 'white' : 'var(--text-secondary)',
            }}
          >
            {r}
          </button>
        ))}
      </div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3157D5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3157D5" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#C2413B" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#C2413B" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${(v * USD_TO_INR / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: 'var(--text-secondary)' }} />
            <Area
              type="monotone"
              dataKey="Spend"
              stroke="#3157D5"
              strokeWidth={2}
              fill="url(#spendGrad)"
              dot={{ r: 3, fill: '#3157D5', strokeWidth: 0 }}
              name="Total Spend"
            />
            <Area
              type="monotone"
              dataKey="Wasted"
              stroke="#C2413B"
              strokeWidth={2}
              fill="url(#wasteGrad)"
              strokeDasharray="5 4"
              dot={{ r: 3, fill: '#C2413B', strokeWidth: 0 }}
              name="Idle/Waste"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
};
