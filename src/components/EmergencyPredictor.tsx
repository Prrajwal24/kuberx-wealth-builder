import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  months: number;
  category: string;
}

const EmergencyPredictor = ({ months, category }: Props) => {
  const icon = category === 'Excellent' || category === 'Safe' ? CheckCircle :
    category === 'At Risk' ? AlertTriangle : XCircle;
  const Icon = icon;
  const color = category === 'Excellent' || category === 'Safe' ? 'text-emerald-accent' :
    category === 'At Risk' ? 'text-gold' : 'text-crimson';

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Emergency Survival</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <motion.div
            className="text-4xl font-display font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {months}
          </motion.div>
          <p className="text-xs text-muted-foreground mt-1">months</p>
        </div>
        <div className="flex-1">
          <div className={`flex items-center gap-2 ${color} mb-2`}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-semibold">{category}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                category === 'Excellent' || category === 'Safe' ? 'bg-accent' :
                category === 'At Risk' ? 'bg-primary' : 'bg-destructive'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((months / 12) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {months >= 6 ? 'You\'re well prepared for emergencies.' : 'Consider building your emergency fund to 6 months.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyPredictor;
