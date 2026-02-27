import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useFinancialProfile';
import { useAuth as useAuthNew } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthNew();
  const { profile, updateProfile } = useAuth();
  
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        </div>

        {/* Profile Settings */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h2>
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

        {/* Logout Section */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <LogOut size={20} />
              Sign Out
            </CardTitle>
            <CardDescription>End your current session</CardDescription>
          </CardHeader>
          <CardContent>
            {showLogoutConfirm ? (
              <div className="space-y-3">
                <Alert className="border-yellow-600 bg-yellow-900/20">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-300">
                    Are you sure you want to log out? You'll need to sign in again.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {loggingOut ? 'Logging out...' : 'Yes, Sign Out'}
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    disabled={loggingOut}
                    className="flex-1 py-2 px-4 rounded-lg bg-secondary border border-border hover:border-primary/50 text-foreground font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            )}
          </CardContent>
        </Card>

        {/* Test Info */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400">Test Full Flow</CardTitle>
            <CardDescription>Try the complete login → onboarding → dashboard flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-400">
              Click "Sign Out" above to return to the login page, then:
            </p>
            <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
              <li><strong>Sign Up</strong> with any email and password</li>
              <li>Enter OTP: <code className="bg-slate-800 px-2 py-1 rounded">123456</code></li>
              <li>Complete the 4-step onboarding</li>
              <li>View your Financial Health Score</li>
            </ol>
            <p className="text-xs text-slate-500 mt-4">
              Using localStorage for now. Data persists until you clear browser storage.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
