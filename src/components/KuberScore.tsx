import { motion } from 'framer-motion';
import { KuberScoreBreakdown } from '@/lib/financial-calculations';

interface KuberScoreProps {
  score: KuberScoreBreakdown;
}

const KuberScore = ({ score }: KuberScoreProps) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score.total / 100) * circumference;

  const statusColor =
    score.status === 'Wealth Builder' ? 'text-emerald-accent' :
    score.status === 'Stable' ? 'text-gold' : 'text-crimson';

  const gradientId = score.status === 'Wealth Builder' ? 'scoreHigh' : score.status === 'Stable' ? 'scoreMid' : 'scoreLow';

  const breakdownItems = [
    { label: 'Savings Rate', value: score.savingsRate, max: 25 },
    { label: 'Emergency Fund', value: score.emergencyFundRatio, max: 20 },
    { label: 'Debt Ratio', value: score.debtToIncomeRatio, max: 20 },
    { label: 'Investment', value: score.investmentConsistency, max: 20 },
    { label: 'Expense Discipline', value: score.expenseDiscipline, max: 15 },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-foreground mb-4">Kuber Score</h3>
      <div className="flex items-center gap-8">
        {/* Score Ring */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90 score-ring" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="scoreLow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0, 72%, 55%)" />
                <stop offset="100%" stopColor="hsl(25, 90%, 55%)" />
              </linearGradient>
              <linearGradient id="scoreMid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(25, 90%, 55%)" />
                <stop offset="100%" stopColor="hsl(43, 85%, 55%)" />
              </linearGradient>
              <linearGradient id="scoreHigh" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(43, 85%, 55%)" />
                <stop offset="100%" stopColor="hsl(155, 55%, 42%)" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(222, 15%, 14%)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-display font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score.total}
            </motion.span>
            <span className={`text-xs font-semibold ${statusColor}`}>{score.status}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3">
          {breakdownItems.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-foreground font-medium">{item.value}/{item.max}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KuberScore;
