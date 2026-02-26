import { useState } from 'react';
import { calculateGoalSIP, formatCurrency } from '@/lib/financial-calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const GoalPlanner = () => {
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [years, setYears] = useState(5);

  const scenarios = [
    { label: 'Conservative (8%)', rate: 8, color: 'hsl(210, 70%, 55%)' },
    { label: 'Balanced (12%)', rate: 12, color: 'hsl(43, 85%, 55%)' },
    { label: 'Aggressive (15%)', rate: 15, color: 'hsl(155, 55%, 42%)' },
  ];

  const sips = scenarios.map(s => ({
    ...s,
    sip: calculateGoalSIP(goalAmount, currentSavings, years, s.rate),
  }));

  // Generate projection data
  const chartData = Array.from({ length: years + 1 }, (_, y) => {
    const point: any = { year: `Year ${y}` };
    scenarios.forEach(s => {
      const r = s.rate / 12 / 100;
      const months = y * 12;
      const sip = calculateGoalSIP(goalAmount, currentSavings, years, s.rate);
      const fvSavings = currentSavings * Math.pow(1 + r, months);
      const fvSIP = r > 0 ? sip * ((Math.pow(1 + r, months) - 1) / r) : sip * months;
      point[s.label] = Math.round(fvSavings + fvSIP);
    });
    return point;
  });

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Goal-Based Investment Planner</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Goal Amount (₹)', value: goalAmount, setter: setGoalAmount },
            { label: 'Current Savings (₹)', value: currentSavings, setter: setCurrentSavings },
            { label: 'Timeline (years)', value: years, setter: setYears },
          ].map(field => (
            <div key={field.label} className="glass-card p-4">
              <label className="text-xs text-muted-foreground mb-2 block">{field.label}</label>
              <input
                type="number"
                value={field.value}
                onChange={e => field.setter(parseInt(e.target.value) || 0)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        {/* SIP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {sips.map(s => (
            <motion.div
              key={s.label}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{formatCurrency(s.sip)}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Growth Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 15%, 18%)" />
                <XAxis dataKey="year" stroke="hsl(220, 10%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222, 20%, 10%)', border: '1px solid hsl(222, 15%, 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(40, 20%, 92%)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                {scenarios.map(s => (
                  <Line key={s.label} type="monotone" dataKey={s.label} stroke={s.color} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalPlanner;
