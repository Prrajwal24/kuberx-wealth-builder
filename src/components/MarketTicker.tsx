import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockMarketData = [
  { name: 'Gold', price: '₹72,450/10g', change: 1.2, trend: 'up' },
  { name: 'Silver', price: '₹85,200/kg', change: -0.5, trend: 'down' },
  { name: 'Nifty 50', price: '24,680', change: 0.8, trend: 'up' },
  { name: 'Sensex', price: '81,245', change: 0.6, trend: 'up' },
];

const MarketTicker = () => {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="font-display font-semibold text-foreground mb-4">Market Pulse</h3>
      <div className="grid grid-cols-2 gap-3">
        {mockMarketData.map(item => (
          <div key={item.name} className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">{item.name}</p>
            <p className="text-sm font-semibold text-foreground">{item.price}</p>
            <div className={`flex items-center gap-1 mt-1 ${item.trend === 'up' ? 'text-emerald-accent' : 'text-crimson'}`}>
              {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-medium">{item.change > 0 ? '+' : ''}{item.change}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MarketTicker;
