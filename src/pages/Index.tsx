import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import {
  calculateKuberScore, calculateSalaryAllocation, calculateEmergencySurvival, formatCurrency
} from '@/lib/financial-calculations';
import KuberScore from '@/components/KuberScore';
import SalaryAllocationWidget from '@/components/SalaryAllocationWidget';
import EmergencyPredictor from '@/components/EmergencyPredictor';
import MarketTicker from '@/components/MarketTicker';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Wallet, PiggyBank, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const { profile } = useFinancialProfile();
  const kuberScore = calculateKuberScore(profile);
  const allocation = calculateSalaryAllocation(profile);
  const emergency = calculateEmergencySurvival(profile.currentSavings, profile.monthlyExpenses);
  const monthlySavings = profile.monthlySalary - profile.monthlyExpenses;

  const quickStats = [
    { label: 'Monthly Salary', value: formatCurrency(profile.monthlySalary), icon: Wallet, trend: null },
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings), icon: PiggyBank, trend: monthlySavings > 0 ? `${Math.round((monthlySavings / profile.monthlySalary) * 100)}% rate` : null },
    { label: 'Total Savings', value: formatCurrency(profile.currentSavings), icon: Sparkles, trend: null },
    { label: 'Active EMIs', value: formatCurrency(profile.existingEMIs), icon: CreditCard, trend: profile.existingEMIs > 0 ? `${Math.round((profile.existingEMIs / profile.monthlySalary) * 100)}% of salary` : 'None' },
  ];

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-gold">{profile.name || 'Wealth Builder'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Your financial command center</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
              {stat.trend && (
                <p className="text-xs text-emerald-accent mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <KuberScore score={kuberScore} />
          <SalaryAllocationWidget allocation={allocation} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmergencyPredictor months={emergency.months} category={emergency.category} />
          <MarketTicker />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
