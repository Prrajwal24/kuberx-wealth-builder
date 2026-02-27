/**
 * Firebase Configuration
 * Note: In production, move these to environment variables
 * For now, using mock/placeholder setup for demonstration
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123",
  authDomain: "kuberx-wealth.firebaseapp.com",
  projectId: "kuberx-wealth",
  storageBucket: "kuberx-wealth.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

/**
 * Initialize Firebase in main.tsx:
 * 
 * import { initializeApp } from 'firebase/app';
 * import { getAuth } from 'firebase/auth';
 * import { getFirestore } from 'firebase/firestore';
 * import { firebaseConfig } from '@/lib/firebase-config';
 * 
 * const app = initializeApp(firebaseConfig);
 * export const auth = getAuth(app);
 * export const db = getFirestore(app);
 */

// Auth state types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  city: string;
  country: string;
  occupation: 'student' | 'salaried' | 'self-employed' | 'freelancer';
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  investments: string[];
  riskProfile: 'conservative' | 'balanced' | 'aggressive' | null;
  financialGoals: FinancialGoal[];
  financialHealthScore: number;
  createdAt: string;
  updatedAt: string;
  onboardingComplete: boolean;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  timeframeMonths: number;
  monthlyRequired: number;
  progress: number;
  createdAt: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: '',
  email: '',
  fullName: '',
  age: 0,
  phoneNumber: '',
  city: '',
  country: '',
  occupation: 'salaried',
  monthlyIncome: 0,
  monthlyExpenses: 0,
  currentSavings: 0,
  investments: [],
  riskProfile: null,
  financialGoals: [],
  financialHealthScore: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  onboardingComplete: false,
};
