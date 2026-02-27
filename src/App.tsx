import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFinancialProfile } from "@/hooks/useFinancialProfile";
import AppSidebar from "@/components/AppSidebar";
import Onboarding from "@/components/Onboarding";
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

const AppContent = () => {
  const { isOnboarded, completeOnboarding } = useFinancialProfile();

  if (!isOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
