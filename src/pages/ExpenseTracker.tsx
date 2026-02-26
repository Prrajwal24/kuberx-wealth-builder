import { useState } from 'react';
import { formatCurrency } from '@/lib/financial-calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Wallet, Plus, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Subscriptions', 'Utilities', 'Entertainment', 'Health', 'Other'];
const COLORS = ['hsl(43,85%,55%)', 'hsl(155,55%,42%)', 'hsl(210,70%,55%)', 'hsl(270,60%,60%)', 'hsl(25,90%,55%)', 'hsl(0,72%,55%)', 'hsl(180,60%,45%)', 'hsl(320,60%,55%)'];

interface Expense { category: string; amount: number; description: string; date: string; }

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { category: 'Food', amount: 8500, description: 'Zomato & Swiggy', date: '2026-02-15' },
    { category: 'Transport', amount: 3200, description: 'Uber & Metro', date: '2026-02-14' },
    { category: 'Subscriptions', amount: 2000, description: 'Netflix, Spotify, YouTube', date: '2026-02-01' },
    { category: 'Shopping', amount: 5500, description: 'Amazon purchases', date: '2026-02-10' },
    { category: 'Utilities', amount: 4000, description: 'Electricity & Internet', date: '2026-02-05' },
    { category: 'Entertainment', amount: 3000, description: 'Movies & dining out', date: '2026-02-12' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Food', amount: 0, description: '' });

  const addExpense = () => {
    if (newExpense.amount > 0) {
      setExpenses(prev => [...prev, { ...newExpense, date: new Date().toISOString().split('T')[0] }]);
      setNewExpense({ category: 'Food', amount: 0, description: '' });
      setShowAdd(false);
    }
  };

  const categoryTotals = CATEGORIES.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter(c => c.value > 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Leak detection
  const leaks = [];
  const foodTotal = categoryTotals.find(c => c.name === 'Food')?.value || 0;
  const subTotal = categoryTotals.find(c => c.name === 'Subscriptions')?.value || 0;
  if (foodTotal > totalExpenses * 0.3) leaks.push('Food delivery spending is over 30% of expenses');
  if (subTotal > 2000) leaks.push('Subscription costs exceeding ₹2,000/month');

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">Expense Tracker</h1>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>

        {showAdd && (
          <motion.div
            className="glass-card p-5 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={newExpense.category}
                onChange={e => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                className="bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount || ''}
                onChange={e => setNewExpense(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                className="bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                placeholder="Description"
                value={newExpense.description}
                onChange={e => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                className="bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button onClick={addExpense} className="gradient-gold text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                Add
              </button>
            </div>
          </motion.div>
        )}

        {/* Leaks */}
        {leaks.length > 0 && (
          <div className="mb-6 space-y-2">
            {leaks.map((leak, i) => (
              <div key={i} className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 text-crimson flex-shrink-0" />
                <span className="text-sm text-crimson">{leak}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Spending Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryTotals.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(222, 20%, 10%)', border: '1px solid hsl(222, 15%, 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(40, 20%, 92%)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-muted-foreground">Total: <span className="text-foreground font-semibold">{formatCurrency(totalExpenses)}</span></p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Category Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTotals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 15%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(220, 10%, 50%)" fontSize={11} />
                  <YAxis stroke="hsl(220, 10%, 50%)" fontSize={11} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(222, 20%, 10%)', border: '1px solid hsl(222, 15%, 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(40, 20%, 92%)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="value" fill="hsl(43, 85%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent expenses */}
        <div className="glass-card p-6 mt-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Recent Expenses</h3>
          <div className="space-y-2">
            {expenses.slice(-8).reverse().map((exp, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm text-foreground">{exp.description}</p>
                  <p className="text-xs text-muted-foreground">{exp.category} · {exp.date}</p>
                </div>
                <span className="text-sm font-semibold text-crimson">-{formatCurrency(exp.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseTracker;
