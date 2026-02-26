import { motion } from 'framer-motion';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const generateMockHistory = (basePrice: number, volatility: number) =>
  Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: Math.round(basePrice + (Math.random() - 0.45) * volatility * basePrice),
  }));

const marketData = [
  { name: 'Gold', price: 72450, unit: '/10g', change: 1.2, history: generateMockHistory(72450, 0.02) },
  { name: 'Silver', price: 85200, unit: '/kg', change: -0.5, history: generateMockHistory(85200, 0.03) },
  { name: 'Nifty 50', price: 24680, unit: '', change: 0.8, history: generateMockHistory(24680, 0.015) },
  { name: 'Sensex', price: 81245, unit: '', change: 0.6, history: generateMockHistory(81245, 0.012) },
];

const Markets = () => {
  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-6">
          <LineChart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Market Intelligence</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketData.map(item => (
            <motion.div
              key={item.name}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">
                    ₹{item.price.toLocaleString('en-IN')}<span className="text-sm text-muted-foreground font-normal">{item.unit}</span>
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${item.change >= 0 ? 'bg-accent/10 text-emerald-accent' : 'bg-destructive/10 text-crimson'}`}>
                  {item.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span className="text-sm font-semibold">{item.change >= 0 ? '+' : ''}{item.change}%</span>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={item.history}>
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(222, 20%, 10%)', border: '1px solid hsl(222, 15%, 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(40, 20%, 92%)' }}
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                      labelFormatter={v => `Day ${v}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={item.change >= 0 ? 'hsl(155, 55%, 42%)' : 'hsl(0, 72%, 55%)'}
                      fill={item.change >= 0 ? 'hsl(155, 55%, 42%)' : 'hsl(0, 72%, 55%)'}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Markets;
