import { useState } from 'react';
import { shouldIBuy, formatCurrency } from '@/lib/financial-calculations';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, Clock, XCircle } from 'lucide-react';

const ShouldIBuy = () => {
  const { profile } = useFinancialProfile();
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof shouldIBuy> | null>(null);

  const evaluate = () => {
    if (itemPrice > 0) {
      setResult(shouldIBuy(itemPrice, profile));
    }
  };

  const verdictConfig = {
    'Approved': { icon: CheckCircle, color: 'text-emerald-accent', bg: 'bg-accent/10 border-accent/30' },
    'Delay Recommended': { icon: Clock, color: 'text-gold', bg: 'bg-primary/10 border-primary/30' },
    'Not Recommended': { icon: XCircle, color: 'text-crimson', bg: 'bg-destructive/10 border-destructive/30' },
  };

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Should I Buy This?</h1>
        </div>

        <div className="glass-card p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-4">Let Kuber evaluate if this purchase fits your financial plan.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">What do you want to buy?</label>
              <input
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="e.g. iPhone 16 Pro"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price (₹)</label>
              <input
                type="number"
                value={itemPrice || ''}
                onChange={e => setItemPrice(parseInt(e.target.value) || 0)}
                placeholder="Enter price"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={evaluate}
              className="w-full py-3 rounded-lg gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity gold-glow"
            >
              Evaluate Purchase
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`glass-card p-6 border ${verdictConfig[result.verdict].bg}`}
            >
              <div className="flex items-center gap-3 mb-4">
                {(() => { const Icon = verdictConfig[result.verdict].icon; return <Icon className={`w-8 h-8 ${verdictConfig[result.verdict].color}`} />; })()}
                <div>
                  <h2 className={`text-xl font-display font-bold ${verdictConfig[result.verdict].color}`}>{result.verdict}</h2>
                  <p className="text-sm text-muted-foreground">{itemName} · {formatCurrency(itemPrice)}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Regret Probability</span>
                  <span className="text-foreground font-medium">{result.regretProbability}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${result.regretProbability > 60 ? 'bg-destructive' : result.regretProbability > 30 ? 'bg-primary' : 'bg-accent'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.regretProbability}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">
                💡 {result.reasoning}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ShouldIBuy;
