import { SalaryAllocation as SalaryAllocationType, formatCurrency } from '@/lib/financial-calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface Props {
  allocation: SalaryAllocationType;
}

const COLORS = [
  'hsl(43, 85%, 55%)',
  'hsl(155, 55%, 42%)',
  'hsl(210, 70%, 55%)',
  'hsl(270, 60%, 60%)',
];

const SalaryAllocationWidget = ({ allocation }: Props) => {
  const data = [
    { name: 'Essentials', value: allocation.essentials },
    { name: 'Investments', value: allocation.investments },
    { name: 'Savings', value: allocation.savings },
    { name: 'Lifestyle', value: allocation.lifestyle },
  ];

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="font-display font-semibold text-foreground mb-4">Salary Allocation</h3>
      <div className="flex items-center gap-6">
        <div className="w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'hsl(222, 20%, 10%)', border: '1px solid hsl(222, 15%, 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(40, 20%, 92%)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
        💡 {allocation.reasoning}
      </p>
    </motion.div>
  );
};

export default SalaryAllocationWidget;
