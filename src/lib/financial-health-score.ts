/**
 * Financial Health Score Calculation
 * Calculates a comprehensive financial health score (0-100) with color coding
 */

import { UserProfile } from './firebase-config';

export interface FinancialHealthScore {
  overallScore: number;
  healthStatus: 'poor' | 'fair' | 'good' | 'excellent';
  healthColor: 'red' | 'yellow' | 'green' | 'emerald';
  categoryScores: {
    incomeStability: number;
    expenseControl: number;
    savingsCapacity: number;
    investmentActivity: number;
    debtManagement: number;
  };
  recommendations: string[];
  analysis: string;
}

export const calculateFinancialHealthScore = (profile: UserProfile): FinancialHealthScore => {
  const categoryScores = {
    incomeStability: 0,
    expenseControl: 0,
    savingsCapacity: 0,
    investmentActivity: 0,
    debtManagement: 0,
  };

  // 1. Income Stability (0-20 points)
  // Higher income = better stability
  if (profile.monthlyIncome > 0) {
    const incomeScore = Math.min(20, (profile.monthlyIncome / 100000) * 20);
    categoryScores.incomeStability = incomeScore;
  }

  // 2. Expense Control (0-20 points)
  // Lower expense ratio = better control
  if (profile.monthlyIncome > 0) {
    const expenseRatio = profile.monthlyExpenses / profile.monthlyIncome;
    if (expenseRatio <= 0.5) {
      categoryScores.expenseControl = 20; // Excellent
    } else if (expenseRatio <= 0.65) {
      categoryScores.expenseControl = 15; // Good
    } else if (expenseRatio <= 0.8) {
      categoryScores.expenseControl = 10; // Fair
    } else if (expenseRatio <= 1) {
      categoryScores.expenseControl = 5; // Poor
    } else {
      categoryScores.expenseControl = 0; // Very poor
    }
  }

  // 3. Savings Capacity (0-20 points)
  // Savings as percentage of income
  if (profile.monthlyIncome > 0) {
    const moneySaved = profile.monthlyIncome - profile.monthlyExpenses;
    const savingsRate = (moneySaved / profile.monthlyIncome) * 100;

    if (savingsRate >= 40) {
      categoryScores.savingsCapacity = 20;
    } else if (savingsRate >= 30) {
      categoryScores.savingsCapacity = 18;
    } else if (savingsRate >= 20) {
      categoryScores.savingsCapacity = 15;
    } else if (savingsRate >= 10) {
      categoryScores.savingsCapacity = 10;
    } else if (savingsRate > 0) {
      categoryScores.savingsCapacity = 5;
    } else {
      categoryScores.savingsCapacity = 0;
    }
  }

  // 4. Investment Activity (0-20 points)
  // Active investments = healthier portfolio
  const investmentCount = profile.investments.length;
  if (investmentCount === 0) {
    categoryScores.investmentActivity = 0;
  } else if (investmentCount === 1) {
    categoryScores.investmentActivity = 8;
  } else if (investmentCount === 2) {
    categoryScores.investmentActivity = 12;
  } else if (investmentCount >= 3) {
    categoryScores.investmentActivity = 20;
  }

  // 5. Debt Management (0-20 points)
  // Consider EMIs and debt-to-income ratio
  const debtToIncomeRatio = profile.monthlyIncome > 0
    ? (profile.monthlyExpenses / profile.monthlyIncome) * 100
    : 0;

  if (debtToIncomeRatio === 0) {
    categoryScores.debtManagement = 20;
  } else if (debtToIncomeRatio <= 25) {
    categoryScores.debtManagement = 18;
  } else if (debtToIncomeRatio <= 40) {
    categoryScores.debtManagement = 15;
  } else if (debtToIncomeRatio <= 60) {
    categoryScores.debtManagement = 10;
  } else if (debtToIncomeRatio <= 80) {
    categoryScores.debtManagement = 5;
  } else {
    categoryScores.debtManagement = 0;
  }

  // Calculate overall score (sum of all categories / 5 * 20, max 100)
  const overallScore = Math.round(
    (categoryScores.incomeStability +
      categoryScores.expenseControl +
      categoryScores.savingsCapacity +
      categoryScores.investmentActivity +
      categoryScores.debtManagement) /
      5
  );

  // Determine health status and color
  let healthStatus: 'poor' | 'fair' | 'good' | 'excellent';
  let healthColor: 'red' | 'yellow' | 'green' | 'emerald';
  let analysis: string;
  const recommendations: string[] = [];

  if (overallScore < 20) {
    healthStatus = 'poor';
    healthColor = 'red';
    analysis = 'Your financial health needs immediate attention. Focus on reducing expenses and building savings.';
    recommendations.push('Create a strict monthly budget');
    recommendations.push('Reduce non-essential spending');
    recommendations.push('Build an emergency fund with at least 3 months of expenses');
  } else if (overallScore < 50) {
    healthStatus = 'fair';
    healthColor = 'yellow';
    analysis = 'Your financial health is moderate. There\'s room for improvement in savings and investments.';
    recommendations.push('Increase monthly savings rate');
    recommendations.push('Start an emergency fund if you haven\'t already');
    recommendations.push('Explore low-risk investment options');
  } else if (overallScore < 75) {
    healthStatus = 'good';
    healthColor = 'green';
    analysis = 'Your financial health is good. Keep building on your strong foundation.';
    recommendations.push('Diversify your investments');
    recommendations.push('Consider long-term wealth building strategies');
    recommendations.push('Maintain your expense discipline');
  } else {
    healthStatus = 'excellent';
    healthColor = 'emerald';
    analysis = 'Your financial health is excellent. You\'re on track for long-term wealth building.';
    recommendations.push('Explore advanced investment strategies');
    recommendations.push('Consider long-term financial planning');
    recommendations.push('Share your knowledge with others');
  }

  // Add specific recommendations based on scores
  if (categoryScores.expenseControl < 10) {
    recommendations.push('Work on reducing your monthly expenses');
  }

  if (categoryScores.savingsCapacity < 10) {
    recommendations.push('Try to save at least 10-20% of your monthly income');
  }

  if (categoryScores.investmentActivity < 10) {
    recommendations.push('Start investing in SIPs or low-cost index funds');
  }

  return {
    overallScore,
    healthStatus,
    healthColor,
    categoryScores,
    recommendations: recommendations.slice(0, 3),
    analysis,
  };
};

/**
 * Get color classes for Tailwind CSS
 */
export const getHealthColorClasses = (color: 'red' | 'yellow' | 'green' | 'emerald') => {
  const colorMap = {
    red: {
      bg: 'bg-red-500/20',
      border: 'border-red-500',
      text: 'text-red-400',
      progress: 'bg-red-500',
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      progress: 'bg-yellow-500',
    },
    green: {
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      text: 'text-green-400',
      progress: 'bg-green-500',
    },
    emerald: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500',
      text: 'text-emerald-400',
      progress: 'bg-emerald-500',
    },
  };

  return colorMap[color];
};
