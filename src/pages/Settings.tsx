import { useState } from 'react';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { formatCurrency } from '@/lib/financial-calculations';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { profile, updateProfile } = useFinancialProfile();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: { label: string; key: keyof typeof profile; type?: string }[] = [
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age', type: 'number' },
    { label: 'Monthly Salary (₹)', key: 'monthlySalary', type: 'number' },
    { label: 'Monthly Expenses (₹)', key: 'monthlyExpenses', type: 'number' },
    { label: 'Current Savings (₹)', key: 'currentSavings', type: 'number' },
    { label: 'Existing EMIs (₹/month)', key: 'existingEMIs', type: 'number' },
  ];

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        </div>

        <div className="glass-card p-6 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type={f.type || 'text'}
                value={profile[f.key] as string | number}
                onChange={e => updateProfile({ [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Risk Appetite</label>
            <div className="grid grid-cols-3 gap-3">
              {(['conservative', 'balanced', 'aggressive'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => updateProfile({ riskAppetite: risk })}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                    profile.riskAppetite === risk
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-lg gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
