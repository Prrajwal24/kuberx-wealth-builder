import { useState } from 'react';
import { shouldIBuy, formatCurrency, calculateEmergencySurvival } from '@/lib/financial-calculations';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { purchaseCategories, allPurchaseItems, getPopularPurchases, PurchaseItem } from '@/lib/purchase-data';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, Clock, XCircle, ChevronDown, Sparkles } from 'lucide-react';

const ShouldIBuy = () => {
  const { profile } = useFinancialProfile();
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  const [customItemName, setCustomItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [isCustom, setIsCustom] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState('');
  const popularItems = getPopularPurchases();

  const handlePurchaseSelect = (item: PurchaseItem) => {
    setSelectedPurchase(item);
    setItemPrice(item.averagePrice);
    setCustomItemName('');
    setIsCustom(false);
    setOpenDropdown(false);
  };

  const handleCustomEntry = () => {
    setIsCustom(true);
    setSelectedPurchase(null);
    setOpenDropdown(false);
  };

  const evaluate = () => {
    const finalPrice = itemPrice > 0 ? itemPrice : 0;
    const finalName = selectedPurchase?.name || customItemName;

    if (finalPrice > 0 && finalName) {
      const baseResult = shouldIBuy(finalPrice, profile);
      const emergencyStatus = calculateEmergencySurvival(profile.currentSavings - finalPrice, profile.monthlyExpenses);
      
      // Calculate financial impact level
      const purchaseToMonthlyIncome = finalPrice / (profile.monthlySalary || 1);
      let financialImpactLevel = 'Low';
      if (purchaseToMonthlyIncome > 1.5) financialImpactLevel = 'High';
      else if (purchaseToMonthlyIncome > 0.5) financialImpactLevel = 'Medium';

      // Enhanced reasoning with purchase metadata
      let enhancedReasoning = baseResult.reasoning;
      if (selectedPurchase) {
        if (selectedPurchase.type === 'investment') {
          enhancedReasoning += ` This is an ${selectedPurchase.type} purchase that may provide long-term value.`;
        } else if (selectedPurchase.depreciationLevel === 'high') {
          enhancedReasoning += ` This item depreciates quickly (high depreciation).`;
        }
        if (emergencyStatus.months < 6) {
          enhancedReasoning += ` Your emergency fund would be ${emergencyStatus.category} after this purchase.`;
        }
      }

      setResult({
        ...baseResult,
        itemName: finalName,
        itemPrice: finalPrice,
        purchaseType: selectedPurchase?.type || 'lifestyle',
        depreciationLevel: selectedPurchase?.depreciationLevel || 'unknown',
        financialImpactLevel,
        emergencyFundAfter: emergencyStatus.months,
        emergencyStatus: emergencyStatus.category,
        reasoning: enhancedReasoning,
      });
    }
  };

  const verdictConfig: any = {
    'Approved': { icon: CheckCircle, color: 'text-emerald-accent', bg: 'bg-accent/10 border-accent/30' },
    'Delay Recommended': { icon: Clock, color: 'text-gold', bg: 'bg-primary/10 border-primary/30' },
    'Not Recommended': { icon: XCircle, color: 'text-crimson', bg: 'bg-destructive/10 border-destructive/30' },
  };

  const impactColors = {
    'Low': 'text-green-500',
    'Medium': 'text-yellow-500',
    'High': 'text-red-500',
  };

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Should I Buy This?</h1>
        </div>

        {/* Quick Pick Buttons */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-3 font-semibold">Quick Picks for Gen Z:</p>
          <div className="flex gap-3 flex-wrap">
            {popularItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePurchaseSelect(item)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPurchase?.id === item.id
                    ? 'gradient-gold text-primary-foreground'
                    : 'bg-secondary border border-border text-foreground hover:border-primary'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-6">Let Kuber evaluate if this purchase fits your financial plan.</p>
          
          <div className="space-y-6">
            {/* Purchase Selection */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-semibold">Purchase Item</label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-left flex items-center justify-between hover:border-primary transition-colors"
                >
                  <span>
                    {selectedPurchase
                      ? `${selectedPurchase.name} (₹${selectedPurchase.averagePrice.toLocaleString()})`
                      : isCustom
                      ? 'Custom Entry'
                      : 'Select from catalog or enter custom'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown ? 'rotate-180' : ''}`} />
                </button>

                {openDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-border rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-border">
                      <button
                        onClick={handleCustomEntry}
                        className="w-full text-left px-4 py-2 hover:bg-primary/20 rounded text-sm text-foreground font-medium"
                      >
                        ✏️ Custom Entry
                      </button>
                    </div>
                    
                    {purchaseCategories.map((category) => (
                      <div key={category.id} className="border-b border-border last:border-b-0">
                        <button
                          onClick={() => setOpenCategoryDropdown(openCategoryDropdown === category.id ? '' : category.id)}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 flex items-center justify-between font-medium text-sm"
                        >
                          <span>{category.icon} {category.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${openCategoryDropdown === category.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {openCategoryDropdown === category.id && (
                          <div className="bg-primary/5 border-t border-border">
                            {category.items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handlePurchaseSelect(item)}
                                className="w-full text-left px-8 py-2 hover:bg-primary/20 text-sm text-foreground flex items-center justify-between"
                              >
                                <span>{item.name}</span>
                                <span className="text-xs text-muted-foreground">₹{item.averagePrice.toLocaleString()}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Entry Field */}
            {isCustom && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-semibold">Item Name</label>
                  <input
                    value={customItemName}
                    onChange={e => setCustomItemName(e.target.value)}
                    placeholder="e.g. Custom Gaming Setup"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </motion.div>
            )}

            {/* Price Field */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-semibold">Price (₹)</label>
              <input
                type="number"
                value={itemPrice || ''}
                onChange={e => setItemPrice(parseInt(e.target.value) || 0)}
                placeholder="Enter or edit price"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {selectedPurchase && (
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Market average: ₹{selectedPurchase.averagePrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* Selected Item Info */}
            {selectedPurchase && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{selectedPurchase.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Depreciation:</span>
                    <p className="font-medium capitalize">{selectedPurchase.depreciationLevel}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={evaluate}
              disabled={!itemPrice || (!selectedPurchase && !customItemName)}
              className="w-full py-3 rounded-lg gradient-gold text-primary-foreground font-semibold hover:opacity-90 transition-opacity gold-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Evaluate Purchase
            </button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`glass-card p-6 border ${verdictConfig[result.verdict].bg} space-y-6`}
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = verdictConfig[result.verdict].icon;
                  return <Icon className={`w-8 h-8 ${verdictConfig[result.verdict].color}`} />;
                })()}
                <div>
                  <h2 className={`text-2xl font-display font-bold ${verdictConfig[result.verdict].color}`}>
                    {result.verdict}
                  </h2>
                  <p className="text-sm text-muted-foreground">{result.itemName} · {formatCurrency(result.itemPrice)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Regret Probability */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Regret Probability</span>
                    <span className="text-foreground font-bold">{result.regretProbability}%</span>
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

                {/* Financial Impact */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Financial Impact</span>
                    <span className={`font-bold ${impactColors[result.financialImpactLevel as keyof typeof impactColors]}`}>
                      {result.financialImpactLevel}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${result.financialImpactLevel === 'High' ? 'bg-red-500' : result.financialImpactLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: result.financialImpactLevel === 'High' ? '100%' : result.financialImpactLevel === 'Medium' ? '60%' : '30%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Fund Status */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-2">Emergency Fund After Purchase:</p>
                  <p className="text-lg font-bold text-foreground">
                    {result.emergencyFundAfter.toFixed(1)} months
                    <span className={`ml-3 text-sm font-medium ${result.emergencyStatus === 'Safe' ? 'text-emerald-accent' : result.emergencyStatus === 'At Risk' ? 'text-gold' : 'text-crimson'}`}>
                      ({result.emergencyStatus})
                    </span>
                  </p>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground">
                  💡 {result.reasoning}
                </p>
              </div>

              {/* Action Items Based on Verdict */}
              {result.verdict === 'Delay Recommended' && (
                <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <p className="text-sm font-medium text-foreground mb-2">Recommendations:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Build your emergency fund to 6 months of expenses</li>
                    <li>Revisit this purchase in 3-6 months</li>
                    <li>Look for discounts or alternative options</li>
                  </ul>
                </div>
              )}

              {result.verdict === 'Not Recommended' && (
                <div className="p-4 bg-crimson/10 rounded-lg border border-crimson/20">
                  <p className="text-sm font-medium text-foreground mb-2">Next Steps:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Focus on strengthening your emergency fund first</li>
                    <li>Pay down existing EMIs to reduce financial burden</li>
                    <li>Increase your monthly savings rate</li>
                  </ul>
                </div>
              )}

              {result.verdict === 'Approved' && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground mb-2">You're All Set! 🎉</p>
                  <p className="text-xs text-muted-foreground">
                    This purchase aligns well with your financial goals. Go ahead and make this investment in yourself!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ShouldIBuy;
