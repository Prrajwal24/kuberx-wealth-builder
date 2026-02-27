export interface FinancialProfile {
  name: string;
  age: number;
  monthlySalary: number;
  monthlyExpenses: number;
  currentSavings: number;
  existingEMIs: number;
  riskAppetite: 'conservative' | 'balanced' | 'aggressive';
  financialGoals: string[];
}

export interface KuberScoreBreakdown {
  savingsRate: number;
  emergencyFundRatio: number;
  debtToIncomeRatio: number;
  investmentConsistency: number;
  expenseDiscipline: number;
  total: number;
  status: 'Vulnerable' | 'Stable' | 'Wealth Builder';
}

export interface SalaryAllocation {
  essentials: number;
  investments: number;
  savings: number;
  lifestyle: number;
  reasoning: string;
}

export function calculateKuberScore(profile: FinancialProfile): KuberScoreBreakdown {
  const { monthlySalary, monthlyExpenses, currentSavings, existingEMIs } = profile;

  const savingsRate = Math.min(((monthlySalary - monthlyExpenses) / monthlySalary) * 100, 100);
  const savingsRateScore = Math.min(savingsRate * 0.5, 25);

  const emergencyMonths = currentSavings / (monthlyExpenses || 1);
  const emergencyFundScore = Math.min((emergencyMonths / 6) * 20, 20);

  const dtiRatio = existingEMIs / (monthlySalary || 1);
  const dtiScore = Math.max(0, 20 - dtiRatio * 50);

  const investmentScore = savingsRate > 20 ? 20 : savingsRate;

  const expenseRatio = monthlyExpenses / (monthlySalary || 1);
  const expenseDisciplineScore = expenseRatio < 0.5 ? 15 : expenseRatio < 0.7 ? 10 : 5;

  const total = Math.round(
    Math.min(savingsRateScore + emergencyFundScore + dtiScore + investmentScore + expenseDisciplineScore, 100)
  );

  return {
    savingsRate: Math.round(savingsRateScore),
    emergencyFundRatio: Math.round(emergencyFundScore),
    debtToIncomeRatio: Math.round(dtiScore),
    investmentConsistency: Math.round(investmentScore),
    expenseDiscipline: Math.round(expenseDisciplineScore),
    total,
    status: total < 40 ? 'Vulnerable' : total < 70 ? 'Stable' : 'Wealth Builder',
  };
}

export function calculateSalaryAllocation(profile: FinancialProfile): SalaryAllocation {
  const { monthlySalary, monthlyExpenses, currentSavings, existingEMIs, riskAppetite } = profile;
  const emergencyMonths = currentSavings / (monthlyExpenses || 1);
  const emiRatio = existingEMIs / (monthlySalary || 1);

  let essentialsPct = 50, investmentsPct = 20, savingsPct = 20, lifestylePct = 10;
  let reasoning = '';

  if (emergencyMonths < 6) {
    savingsPct += 10;
    lifestylePct -= 5;
    investmentsPct -= 5;
    reasoning += 'Emergency fund is below 6 months — boosting savings. ';
  }

  if (emiRatio > 0.3) {
    lifestylePct -= 5;
    essentialsPct += 5;
    reasoning += 'High EMI burden — reducing discretionary spending. ';
  }

  if (riskAppetite === 'aggressive') {
    investmentsPct += 5;
    lifestylePct -= 5;
    reasoning += 'Aggressive risk profile — higher investment allocation. ';
  }

  if (!reasoning) reasoning = 'Balanced allocation based on your financial profile.';

  return {
    essentials: Math.round(monthlySalary * (essentialsPct / 100)),
    investments: Math.round(monthlySalary * (investmentsPct / 100)),
    savings: Math.round(monthlySalary * (savingsPct / 100)),
    lifestyle: Math.round(monthlySalary * (lifestylePct / 100)),
    reasoning: reasoning.trim(),
  };
}

export function calculateEmergencySurvival(savings: number, expenses: number) {
  const months = expenses > 0 ? savings / expenses : 0;
  const category = months >= 12 ? 'Excellent' : months >= 6 ? 'Safe' : months >= 3 ? 'At Risk' : 'Critical';
  return { months: Math.round(months * 10) / 10, category };
}

export function calculateGoalSIP(goalAmount: number, currentSavings: number, years: number, annualReturn: number) {
  const months = years * 12;
  const r = annualReturn / 12 / 100;
  const futureValueOfCurrent = currentSavings * Math.pow(1 + r, months);
  const remaining = Math.max(goalAmount - futureValueOfCurrent, 0);
  if (r === 0) return Math.round(remaining / months);
  const sip = remaining * r / (Math.pow(1 + r, months) - 1);
  return Math.round(sip);
}

export function simulateWealth(salary: number, annualIncrement: number, monthlySIP: number, inflationRate: number, years: number) {
  const data: { year: number; invested: number; wealth: number; realWealth: number }[] = [];
  let totalInvested = 0;
  let wealth = 0;
  let currentSalary = salary;
  let currentSIP = monthlySIP;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      totalInvested += currentSIP;
      wealth = (wealth + currentSIP) * (1 + 0.12 / 12);
    }
    const realWealth = wealth / Math.pow(1 + inflationRate / 100, y);
    data.push({ year: y, invested: Math.round(totalInvested), wealth: Math.round(wealth), realWealth: Math.round(realWealth) });
    currentSalary *= 1 + annualIncrement / 100;
    currentSIP = Math.round(currentSIP * (1 + annualIncrement / 100));
  }
  return data;
}

export function shouldIBuy(
  itemPrice: number,
  profile: FinancialProfile
): { verdict: 'Approved' | 'Delay Recommended' | 'Not Recommended'; regretProbability: number; reasoning: string } {
  const { currentSavings, monthlyExpenses, existingEMIs, monthlySalary } = profile;
  const emergencyMonths = currentSavings / (monthlyExpenses || 1);
  const afterPurchase = currentSavings - itemPrice;
  const afterEmergency = afterPurchase / (monthlyExpenses || 1);
  const priceToSalaryRatio = itemPrice / (monthlySalary || 1);

  let score = 100;
  let reasoning = '';

  if (afterEmergency < 3) { score -= 40; reasoning += 'Purchase would reduce emergency fund below 3 months. '; }
  if (priceToSalaryRatio > 1) { score -= 30; reasoning += 'Item costs more than one month\'s salary. '; }
  if (existingEMIs / (monthlySalary || 1) > 0.3) { score -= 20; reasoning += 'Existing EMI commitments are high. '; }
  if (itemPrice > currentSavings * 0.3) { score -= 10; reasoning += 'Would use significant portion of savings. '; }

  const regretProbability = Math.min(100 - score, 95);
  const verdict = score >= 70 ? 'Approved' : score >= 40 ? 'Delay Recommended' : 'Not Recommended';

  return { verdict, regretProbability, reasoning: reasoning || 'Purchase looks financially safe!' };
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const defaultProfile: FinancialProfile = {
  name: '',
  age: 25,
  monthlySalary: 50000,
  monthlyExpenses: 30000,
  currentSavings: 100000,
  existingEMIs: 0,
  riskAppetite: 'balanced',
  financialGoals: ['Emergency Fund'],
};
