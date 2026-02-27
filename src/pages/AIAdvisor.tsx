import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { formatCurrency } from '@/lib/financial-calculations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAdvisor = () => {
  const { profile } = useFinancialProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your KuberX AI Financial Advisor. I can see your financial profile — earning ${formatCurrency(profile.monthlySalary)}/month with ${formatCurrency(profile.currentSavings)} in savings. How can I help you today?\n\nYou can ask me about:\n- Investment strategies\n- Tax saving tips\n- Budgeting advice\n- Financial goal planning`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('invest') || q.includes('sip')) {
      return `Based on your ${profile.riskAppetite} risk profile and ${formatCurrency(profile.monthlySalary)} salary, I recommend:\n\n📊 **Monthly SIP Plan:**\n- Nifty 50 Index Fund: ${formatCurrency(profile.monthlySalary * 0.1)}/month\n- Mid Cap Fund: ${formatCurrency(profile.monthlySalary * 0.05)}/month\n- PPF: ${formatCurrency(profile.monthlySalary * 0.05)}/month\n\nStart with index funds for stability, then diversify as your emergency fund grows.`;
    }
    if (q.includes('tax') || q.includes('save tax')) {
      return `Here are tax-saving strategies for your salary of ${formatCurrency(profile.monthlySalary * 12)}/year:\n\n🏦 **Section 80C (Max ₹1.5L):**\n- ELSS Mutual Funds (3-year lock-in, best returns)\n- PPF (15-year, safe, tax-free returns)\n\n🏥 **Section 80D:**\n- Health Insurance Premium (up to ₹25,000)\n\n🏠 **HRA:**\n- If paying rent, claim HRA exemption\n\nEstimated tax savings: ₹45,000-₹65,000/year`;
    }
    if (q.includes('budget') || q.includes('expense') || q.includes('spend')) {
      const savings = profile.monthlySalary - profile.monthlyExpenses;
      return `Your savings rate is ${Math.round((savings / profile.monthlySalary) * 100)}%. ${savings / profile.monthlySalary > 0.3 ? 'Great job!' : 'There\'s room for improvement.'}\n\n💡 **Suggestions:**\n- Follow 50/30/20 rule: 50% needs, 30% wants, 20% savings\n- Track subscriptions monthly\n- Cook more, order less\n- Use UPI cashback offers\n\nTarget: Save at least ${formatCurrency(profile.monthlySalary * 0.3)}/month`;
    }
    if (q.includes('emergency') || q.includes('fund')) {
      const months = profile.currentSavings / profile.monthlyExpenses;
      return `Your emergency fund covers ${months.toFixed(1)} months.\n\n${months >= 6 ? '✅ You\'re well-prepared!' : `⚠️ Target: ${formatCurrency(profile.monthlyExpenses * 6)} (6 months expenses)\nShortfall: ${formatCurrency(Math.max(profile.monthlyExpenses * 6 - profile.currentSavings, 0))}\n\nKeep this in a liquid fund or savings account for quick access.`}`;
    }
    return `Great question! Based on your financial profile (${formatCurrency(profile.monthlySalary)} salary, ${profile.riskAppetite} risk appetite), here's my advice:\n\n1. **Prioritize** building a 6-month emergency fund\n2. **Automate** your investments via SIP on salary day\n3. **Track** every expense to find saving opportunities\n4. **Learn** about tax-saving instruments under Section 80C\n\nWant me to dive deeper into any of these areas?`;
  };

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="p-8 ml-64 h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">AI Financial Advisor</h1>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'gradient-gold text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-xl px-4 py-3 text-sm text-muted-foreground">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about investments, tax, budgeting..."
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="px-4 rounded-lg gradient-gold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
