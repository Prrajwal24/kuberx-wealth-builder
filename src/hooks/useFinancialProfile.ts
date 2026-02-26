import { useState, useEffect } from 'react';
import { FinancialProfile, defaultProfile } from '@/lib/financial-calculations';

const STORAGE_KEY = 'kuberx-profile';

export function useFinancialProfile() {
  const [profile, setProfile] = useState<FinancialProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  useEffect(() => {
    if (isOnboarded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isOnboarded]);

  const updateProfile = (updates: Partial<FinancialProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (p: FinancialProfile) => {
    setProfile(p);
    setIsOnboarded(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  };

  return { profile, updateProfile, isOnboarded, completeOnboarding };
}
