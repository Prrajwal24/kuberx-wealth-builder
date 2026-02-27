import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Target, Wallet, ShieldCheck, TrendingUp,
  ShoppingBag, LineChart, GraduationCap, Bot, Settings
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/goals', icon: Target, label: 'Goal Planner' },
  { to: '/expenses', icon: Wallet, label: 'Expenses' },
  { to: '/should-i-buy', icon: ShoppingBag, label: 'Should I Buy?' },
  { to: '/simulator', icon: TrendingUp, label: 'Wealth Simulator' },
  { to: '/markets', icon: LineChart, label: 'Markets' },
  { to: '/academy', icon: GraduationCap, label: 'Academy' },
  { to: '/advisor', icon: Bot, label: 'AI Advisor' },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center font-display font-bold text-primary-foreground text-lg">
          K
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-foreground tracking-tight">KuberX</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Wealth Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sidebar-accent text-primary gold-glow'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;
