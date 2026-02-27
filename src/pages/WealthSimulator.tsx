import { useState } from 'react';
import { simulateWealth, formatCurrency } from '@/lib/financial-calculations';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const WealthSimulator = () => {
  const { profile } = useFinancialProfile();
  const [annualIncrement, setAnnualIncrement] = useState(10);
  const [monthlySIP, setMonthlySIP] = useState(Math.round(profile.monthlySalary * 0.2));
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(20);

  const data = simulateWealth(profile.monthlySalary, annualIncrement, monthlySIP, inflation, years);

  const milestones = [5, 10, 20].map(y => {
    const point = data.find(d => d.year === y);
    return point ? { year: y, wealth: point.wealth, realWealth: point.realWealth } : null;
  }).filter(Boolean);

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Future Wealth Simulator</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Annual Increment %', value: annualIncrement, setter: setAnnualIncrement },
            { label: 'Monthly SIP (₹)', value: monthlySIP, setter: setMonthlySIP },
            { label: 'Inflation %', value: inflation, setter: setInflation },
            { label: 'Years', value: years, setter: setYears },
          ].map(f => (
            <div key={f.label} className="glass-card p-4">
              <label className="text-xs text-muted-foreground mb-2 block">{f.label}</label>
              <input
                type="number"
                value={f.value}
                onChange={e => f.setter(parseInt(e.target.value) || 0)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        {/* Milestone Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {milestones.map(m => m && (
            <div key={m.year} className="glass-card p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">In {m.year} years</p>
              <p className="text-xl font-display font-bold text-foreground">{formatCurrency(m.wealth)}</p>
              <p className="text-xs text-emerald-accent mt-1">Real value: {formatCurrency(m.realWealth)}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Wealth Growth Trajectory</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 15%, 18%)" />
                <XAxis dataKey="year" stroke="hsl(220, 10%, 50%)" fontSize={12} tickFormatter={v => `Y${v}`} />
                <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222, 20%, 10%)', border: '1px solid hsl(222, 15%, 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(40, 20%, 92%)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area type="monotone" dataKey="wealth" name="Nominal Wealth" stroke="hsl(43, 85%, 55%)" fill="hsl(43, 85%, 55%)" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="invested" name="Invested" stroke="hsl(210, 70%, 55%)" fill="hsl(210, 70%, 55%)" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="realWealth" name="Inflation Adjusted" stroke="hsl(155, 55%, 42%)" fill="hsl(155, 55%, 42%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WealthSimulator;
