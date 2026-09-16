import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  PieChart, Pie,
  LineChart, Line
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#14b8a6', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-xl border border-gray-700 text-xs shadow-xl">
        <p className="font-bold text-gray-200 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="font-medium" style={{ color: entry.color }}>
            {entry.name}: ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DepartmentSpendChart = ({ data = [] }) => {
  const chartData = data.map(d => ({
    name: d.department,
    Actual: Number(d.actualMonthlySpendUSD || 0),
    Budget: Number(d.budgetLimitUSD || 5000),
  }));

  return (
    <div className="glass-card p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Departmental Spend vs. Budget Limit</h3>
          <p className="text-xs text-gray-400">Monthly aggregate USD baseline</p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Actual" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Budget" fill="#374151" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CategorySpendChart = ({ data = [] }) => {
  const chartData = data.map(d => ({
    name: d.category,
    value: Number(d.monthlySpendUSD || 0),
  }));

  return (
    <div className="glass-card p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Spend by Category</h3>
          <p className="text-xs text-gray-400">Category cost breakdown</p>
        </div>
      </div>
      <div className="h-72 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MonthlyTrendChart = () => {
  const trendData = [
    { month: 'Apr', Spend: 28500, Wasted: 4500 },
    { month: 'May', Spend: 31200, Wasted: 4800 },
    { month: 'Jun', Spend: 34000, Wasted: 5100 },
    { month: 'Jul', Spend: 36800, Wasted: 4200 },
    { month: 'Aug', Spend: 38240, Wasted: 3390 },
    { month: 'Sep', Spend: 39040, Wasted: 3390 },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Monthly Spend & Waste Trend</h3>
          <p className="text-xs text-gray-400">6-Month financial trajectory</p>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="Spend" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Wasted" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
