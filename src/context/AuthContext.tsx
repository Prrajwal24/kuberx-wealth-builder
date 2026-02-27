import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, UserProfile, DEFAULT_USER_PROFILE } from '@/lib/firebase-config';

interface AuthContextType {
  currentUser: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  verifyPhoneOTP: (phoneNumber: string, otp: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage (mock Firebase)
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('kuberx-auth');
      const storedProfile = localStorage.getItem('kuberx-profile');

      if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        setCurrentUser(auth);
        setIsAuthenticated(true);
      }

      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in production, use Firebase
      // await signInWithEmailAndPassword(auth, email, password);
      
      const mockUser: AuthUser = {
        uid: `user_${Date.now()}`,
        email,
        displayName: null,
        photoURL: null,
        emailVerified: true,
        phoneNumber: null,
      };

      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('kuberx-auth', JSON.stringify(mockUser));

      // Load or create user profile
      let profile = userProfile || { ...DEFAULT_USER_PROFILE, email, id: mockUser.uid };
      setUserProfile(profile);
      localStorage.setItem('kuberx-profile', JSON.stringify(profile));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    setLoading(true);
    try {
      // Mock signup - in production, use Firebase
      // await createUserWithEmailAndPassword(auth, email, password);
      
      const mockUser: AuthUser = {
        uid: `user_${Date.now()}`,
        email,
        displayName: fullName,
        photoURL: null,
        emailVerified: false,
        phoneNumber,
      };

      const newProfile: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        id: mockUser.uid,
        email,
        fullName,
        phoneNumber,
      };

      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      setUserProfile(newProfile);

      localStorage.setItem('kuberx-auth', JSON.stringify(mockUser));
      localStorage.setItem('kuberx-profile', JSON.stringify(newProfile));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem('kuberx-auth');
      localStorage.removeItem('kuberx-profile');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;

    const updated = {
      ...userProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setUserProfile(updated);
    localStorage.setItem('kuberx-profile', JSON.stringify(updated));
  };

  const sendPasswordResetEmail = async (email: string) => {
    // Mock implementation - in production, use Firebase
    // await sendPasswordReset(email);
    console.log('Password reset email sent to:', email);
  };

  const verifyPhoneOTP = async (phoneNumber: string, otp: string) => {
    // Mock implementation - in production, use Firebase/Twilio
    console.log('Phone OTP verified:', phoneNumber, otp);
  };

  const signInWithGoogle = async () => {
    // Mock Google sign-in - in production, use Firebase
    const mockUser: AuthUser = {
      uid: `google_${Date.now()}`,
      email: 'user@gmail.com',
      displayName: 'User Name',
      photoURL: 'https://via.placeholder.com/40',
      emailVerified: true,
      phoneNumber: null,
    };

    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('kuberx-auth', JSON.stringify(mockUser));
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated,
    isOnboarded: userProfile?.onboardingComplete ?? false,
    login,
    signUp,
    logout,
    updateUserProfile,
    sendPasswordResetEmail,
    verifyPhoneOTP,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
