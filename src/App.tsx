import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import Onboarding from "@/components/Onboarding";
import { EnhancedOnboarding } from "@/pages/EnhancedOnboarding";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import Index from "./pages/Index";
import GoalPlanner from "./pages/GoalPlanner";
import ExpenseTracker from "./pages/ExpenseTracker";
import ShouldIBuy from "./pages/ShouldIBuy";
import WealthSimulator from "./pages/WealthSimulator";
import Markets from "./pages/Markets";
import Academy from "./pages/Academy";
import AIAdvisor from "./pages/AIAdvisor";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Onboarding route wrapper
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isOnboarded, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (isOnboarded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated, isOnboarded, loading } = useAuth();
  const { isOnboarded: legacyOnboarded, completeOnboarding } = useFinancialProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Legacy support: if old onboarding is not complete and new auth is verified, show old onboarding
  if (isAuthenticated && !isOnboarded && !legacyOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<EnhancedOnboarding />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!isOnboarded) {
    return <EnhancedOnboarding />;
  }

  return (
    <>
      <AppSidebar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/goals" element={<GoalPlanner />} />
        <Route path="/expenses" element={<ExpenseTracker />} />
        <Route path="/should-i-buy" element={<ShouldIBuy />} />
        <Route path="/simulator" element={<WealthSimulator />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/advisor" element={<AIAdvisor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
