import { useState } from 'react';
import { FinancialProfile, defaultProfile } from '@/lib/financial-calculations';
import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: (profile: FinancialProfile) => void;
}

const goals = ['Emergency Fund', 'House', 'Car', 'Travel', 'Retirement', 'Wedding', 'Education', 'Business'];

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<FinancialProfile>({ ...defaultProfile });

  const update = (key: keyof FinancialProfile, value: any) =>
    setProfile(prev => ({ ...prev, [key]: value }));

  const toggleGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const steps = [
    // Step 0: Name & Age
    <div key="basic" className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Let's get to know you</h2>
      <p className="text-muted-foreground">Your name and age help personalize your financial roadmap.</p>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
          <input
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={profile.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Age</label>
          <input
            type="number"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={profile.age}
            onChange={e => update('age', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>,
    // Step 1: Income & Expenses
    <div key="income" className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Your finances</h2>
      <p className="text-muted-foreground">Monthly income and expense details.</p>
      <div className="space-y-4">
        {[
          { label: 'Monthly Salary (₹)', key: 'monthlySalary' as const },
          { label: 'Monthly Expenses (₹)', key: 'monthlyExpenses' as const },
          { label: 'Current Savings (₹)', key: 'currentSavings' as const },
          { label: 'Existing EMIs (₹/month)', key: 'existingEMIs' as const },
        ].map(field => (
          <div key={field.key}>
            <label className="text-sm text-muted-foreground mb-1 block">{field.label}</label>
            <input
              type="number"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={profile[field.key]}
              onChange={e => update(field.key, parseInt(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
    </div>,
    // Step 2: Risk & Goals
    <div key="goals" className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Risk & Goals</h2>
      <p className="text-muted-foreground">Your investment style and financial aspirations.</p>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Risk Appetite</label>
        <div className="grid grid-cols-3 gap-3">
          {(['conservative', 'balanced', 'aggressive'] as const).map(risk => (
            <button
              key={risk}
              onClick={() => update('riskAppetite', risk)}
              className={`py-3 px-4 rounded-lg border text-sm font-medium capitalize transition-all ${
                profile.riskAppetite === risk
                  ? 'bg-primary text-primary-foreground border-primary gold-glow'
                  : 'bg-secondary border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Financial Goals</label>
        <div className="flex flex-wrap gap-2">
          {goals.map(goal => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                profile.financialGoals.includes(goal)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary border border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-lg"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center font-display font-bold text-primary-foreground text-lg">
            K
          </div>
          <span className="font-display font-bold text-xl text-foreground">KuberX</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps[step]}
        </motion.div>

        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1);
              else onComplete(profile);
            }}
            className="ml-auto px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity gold-glow"
          >
            {step < steps.length - 1 ? 'Continue' : 'Launch KuberX'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
