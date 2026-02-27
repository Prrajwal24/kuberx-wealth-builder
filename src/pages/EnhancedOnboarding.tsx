import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  DollarSign,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '@/lib/firebase-config';
import { calculateFinancialHealthScore } from '@/lib/financial-health-score';

type OnboardingStep = 'basic' | 'financial' | 'risk' | 'goals' | 'complete';

interface InvestmentType {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  icon: string;
}

const INVESTMENTS: InvestmentType[] = [
  { id: 'sip', name: 'Mutual Fund SIPs', riskLevel: 'low', icon: '📈' },
  { id: 'fpd', name: 'Fixed Deposits', riskLevel: 'low', icon: '🏦' },
  { id: 'stocks', name: 'Stocks', riskLevel: 'high', icon: '📊' },
  { id: 'gold', name: 'Gold/Silver', riskLevel: 'medium', icon: '🥇' },
  { id: 'crypto', name: 'Cryptocurrency', riskLevel: 'high', icon: '₿' },
  { id: 'realestate', name: 'Real Estate', riskLevel: 'medium', icon: '🏠' },
  { id: 'bonds', name: 'Bonds', riskLevel: 'low', icon: '📜' },
  { id: 'nps', name: 'NPS/Pension', riskLevel: 'low', icon: '🔒' },
];

const FINANCIAL_GOALS = [
  { id: 'emergency', name: 'Emergency Fund', icon: '🚨', description: '3-6 months of expenses' },
  { id: 'home', name: 'Buy a Home', icon: '🏡', description: 'Dream house down payment' },
  { id: 'vehicle', name: 'Buy a Vehicle', icon: '🚗', description: 'Car or bike purchase' },
  { id: 'travel', name: 'International Travel', icon: '✈️', description: 'Dream vacation' },
  { id: 'education', name: 'Education', icon: '🎓', description: 'Upskilling or degree' },
  { id: 'retirement', name: 'Retirement', icon: '🏖️', description: 'Secure retirement' },
  { id: 'wedding', name: 'Wedding', icon: '💍', description: 'Wedding expenses' },
  { id: 'business', name: 'Start a Business', icon: '🚀', description: 'Entrepreneurship' },
];

export const EnhancedOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserProfile, userProfile } = useAuth();

  const [step, setStep] = useState<OnboardingStep>('basic');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: userProfile?.age || 0,
    city: userProfile?.city || '',
    country: userProfile?.country || 'India',
    occupation: userProfile?.occupation || 'salaried',
    monthlyIncome: userProfile?.monthlyIncome || 0,
    monthlyExpenses: userProfile?.monthlyExpenses || 0,
    currentSavings: userProfile?.currentSavings || 0,
    investments: userProfile?.investments || [],
    riskProfile: userProfile?.riskProfile || 'balanced',
    financialGoals: userProfile?.financialGoals?.map((g) => g.name) || [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('monthly') || name === 'age' || name === 'currentSavings'
        ? parseInt(value) || 0
        : value,
    }));
  };

  const toggleArrayField = (field: string, value: string) => {
    setFormData((prev) => {
      const currentArray = (prev[field as keyof UserProfile] as string[]) || [];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Move to next step
      const steps: OnboardingStep[] = ['basic', 'financial', 'risk', 'goals', 'complete'];
      const currentIndex = steps.indexOf(step);
      
      if (currentIndex < steps.length - 1) {
        setStep(steps[currentIndex + 1]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create goal objects
      const goalsData = (formData.financialGoals as string[])?.map((goalName) => ({
        id: `goal_${Date.now()}_${Math.random()}`,
        name: goalName,
        targetAmount: 1000000,
        timeframeMonths: 60,
        monthlyRequired: 16666,
        progress: 0,
        createdAt: new Date().toISOString(),
      })) || [];

      const updatedProfile: Partial<UserProfile> = {
        ...formData,
        financialGoals: goalsData as any,
        onboardingComplete: true,
        updatedAt: new Date().toISOString(),
      };

      await updateUserProfile(updatedProfile);
      setStep('complete');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/');
  };

  const stepConfig = {
    basic: {
      number: 1,
      title: 'Basic Details',
      description: 'Tell us about yourself',
      icon: <User className="w-5 h-5" />,
    },
    financial: {
      number: 2,
      title: 'Financial Profile',
      description: 'Your income and expenses',
      icon: <DollarSign className="w-5 h-5" />,
    },
    risk: {
      number: 3,
      title: 'Risk Assessment',
      description: 'Your investment style',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    goals: {
      number: 4,
      title: 'Financial Goals',
      description: 'What do you want to achieve?',
      icon: <Target className="w-5 h-5" />,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -top-40 -left-40"></div>
        <div className="absolute w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -bottom-40 -right-40"></div>
      </div>

      {step !== 'complete' && (
        <div className="max-w-4xl mx-auto mb-8">
          {/* Progress Indicator */}
          <div className="relative">
            <div className="flex justify-between relative z-10">
              {(['basic', 'financial', 'risk', 'goals'] as OnboardingStep[]).map((s, idx) => (
                <motion.div
                  key={s}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step === s
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 scale-110'
                        : ['basic', 'financial', 'risk', 'goals'].indexOf(step) > idx
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-slate-400'
                    }`}
                    whileScale={{ scale: step === s ? 1.1 : 1 }}
                  >
                    {['basic', 'financial', 'risk', 'goals'].indexOf(step) > idx ? '✓' : idx + 1}
                  </motion.div>
                  <p className="text-xs text-slate-400 mt-2 text-center">{stepConfig[s].title}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-700 rounded-full -z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((['basic', 'financial', 'risk', 'goals'].indexOf(step) + 1) / 4) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto relative z-20">
        <AnimatePresence mode="wait">
          {step === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Tell us about yourself</CardTitle>
                  <CardDescription className="text-slate-400">
                    This helps us personalize your financial experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Age *</label>
                      <Input
                        type="number"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleInputChange}
                        placeholder="25"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        min="18"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Occupation *</label>
                      <select
                        name="occupation"
                        value={formData.occupation || 'salaried'}
                        onChange={handleInputChange}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="student">Student</option>
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="freelancer">Freelancer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">City *</label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Country *</label>
                      <Input
                        type="text"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                        placeholder="India"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleContinue}
                      disabled={!formData.age || !formData.city || !formData.country}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 font-semibold"
                    >
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Financial Profile</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your income, expenses, and savings information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Monthly Income (₹) *</label>
                    <Input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome || ''}
                      onChange={handleInputChange}
                      placeholder="50000"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Monthly Expenses (₹) *</label>
                    <Input
                      type="number"
                      name="monthlyExpenses"
                      value={formData.monthlyExpenses || ''}
                      onChange={handleInputChange}
                      placeholder="30000"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Current Savings (₹)</label>
                    <Input
                      type="number"
                      name="currentSavings"
                      value={formData.currentSavings || ''}
                      onChange={handleInputChange}
                      placeholder="200000"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  {formData.monthlyIncome !== undefined && formData.monthlyExpenses !== undefined && (
                    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Monthly Savings:</span>
                        <span className="text-yellow-400 font-semibold">
                          ₹{(formData.monthlyIncome - formData.monthlyExpenses).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-slate-300">Savings Rate:</span>
                        <span className="text-yellow-400 font-semibold">
                          {formData.monthlyIncome &&
                            (((formData.monthlyIncome - formData.monthlyExpenses) /
                              formData.monthlyIncome) *
                              100).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Investments</label>
                    <div className="grid grid-cols-2 gap-3">
                      {INVESTMENTS.map((inv) => (
                        <motion.button
                          key={inv.id}
                          onClick={() => toggleArrayField('investments', inv.id)}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            (formData.investments as string[])?.includes(inv.id)
                              ? 'bg-yellow-500/20 border-yellow-500'
                              : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-lg">{inv.icon}</div>
                          <div className="text-sm font-medium text-slate-300">{inv.name}</div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {inv.riskLevel}
                          </Badge>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep('basic')}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      disabled={!formData.monthlyIncome}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 font-semibold"
                    >
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Investment Risk Profile</CardTitle>
                  <CardDescription className="text-slate-400">
                    What's your comfort level with investment risk?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {[
                      {
                        value: 'conservative',
                        title: 'Conservative',
                        description: 'Prefer stable returns over growth',
                        emoji: '🛡️',
                      },
                      {
                        value: 'balanced',
                        title: 'Balanced',
                        description: 'Mix of stability and growth',
                        emoji: '⚖️',
                      },
                      {
                        value: 'aggressive',
                        title: 'Aggressive',
                        description: 'Willing to take risks for higher returns',
                        emoji: '🚀',
                      },
                    ].map((profile) => (
                      <motion.button
                        key={profile.value}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            riskProfile: profile.value as any,
                          }))
                        }
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.riskProfile === profile.value
                            ? 'bg-yellow-500/20 border-yellow-500'
                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-white">{profile.emoji} {profile.title}</div>
                            <p className="text-sm text-slate-400 mt-1">{profile.description}</p>
                          </div>
                          {formData.riskProfile === profile.value && (
                            <CheckCircle2 className="w-6 h-6 text-yellow-400 flex-shrink-0 ml-4" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep('financial')}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 font-semibold"
                    >
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Financial Goals</CardTitle>
                  <CardDescription className="text-slate-400">
                    Select the goals that matter to you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {FINANCIAL_GOALS.map((goal) => (
                      <motion.button
                        key={goal.id}
                        onClick={() => toggleArrayField('financialGoals', goal.name)}
                        className={`p-4 rounded-lg border transition-all text-left ${
                          (formData.financialGoals as string[])?.includes(goal.name)
                            ? 'bg-yellow-500/20 border-yellow-500'
                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-2">{goal.icon}</div>
                        <div className="text-sm font-semibold text-white">{goal.name}</div>
                        <p className="text-xs text-slate-400 mt-1">{goal.description}</p>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setStep('risk')}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={
                        loading ||
                        !formData.financialGoals ||
                        formData.financialGoals.length === 0
                      }
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 font-semibold"
                    >
                      {loading ? 'Completing...' : 'Complete Setup'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
                <CardContent className="pt-8">
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.8, delay: 0.1 }}
                      className="flex justify-center"
                    >
                      <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="space-y-3"
                    >
                      <h2 className="text-3xl font-bold text-white">Welcome to KuberX!</h2>
                      <p className="text-slate-400 max-w-md mx-auto">
                        Your profile is ready. We've created a personalized financial roadmap based on your goals and
                        preferences.
                      </p>
                    </motion.div>

                    {userProfile && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-left max-w-md mx-auto"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-semibold text-yellow-400">Financial Health Score</span>
                        </div>
                        {(() => {
                          const score = calculateFinancialHealthScore(userProfile);
                          return (
                            <div>
                              <div className="flex items-end gap-3 mb-3">
                                <div className="text-4xl font-bold text-white">{score.overallScore}/100</div>
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                    score.healthColor === 'red'
                                      ? 'bg-red-500/20 text-red-400'
                                      : score.healthColor === 'yellow'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : score.healthColor === 'green'
                                          ? 'bg-green-500/20 text-green-400'
                                          : 'bg-emerald-500/20 text-emerald-400'
                                  }`}
                                >
                                  {score.healthStatus}
                                </div>
                              </div>
                              <p className="text-xs text-slate-400">{score.analysis}</p>
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <Button
                        onClick={handleNavigateToDashboard}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-slate-900 font-semibold h-12 text-base"
                      >
                        Go to Dashboard
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
