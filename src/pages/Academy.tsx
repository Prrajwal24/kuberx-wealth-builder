import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle, Star, Flame } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz: { question: string; options: string[]; correct: number };
  xp: number;
}

const lessons: Lesson[] = [
  {
    id: 'credit-debit',
    title: 'Credit vs Debit',
    content: 'A debit card uses money directly from your bank account. A credit card borrows money from the bank, which you must repay. Credit cards offer rewards but carry interest risk if you don\'t pay the full balance monthly.',
    quiz: { question: 'What happens if you don\'t pay your credit card bill in full?', options: ['Nothing', 'You earn rewards', 'Interest is charged', 'Card gets upgraded'], correct: 2 },
    xp: 50,
  },
  {
    id: 'compound-interest',
    title: 'Simple vs Compound Interest',
    content: 'Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus accumulated interest. This is why starting early matters — your money earns money on money!',
    quiz: { question: 'Compound interest is calculated on:', options: ['Only principal', 'Principal + interest', 'Only interest', 'None'], correct: 1 },
    xp: 60,
  },
  {
    id: 'inflation',
    title: 'Understanding Inflation',
    content: 'Inflation is the rate at which prices increase over time. If inflation is 6% and your savings earn 4%, you\'re actually losing 2% purchasing power annually. Your investments must beat inflation to grow real wealth.',
    quiz: { question: 'If inflation is 7% and FD returns 5%, you are:', options: ['Gaining wealth', 'Breaking even', 'Losing purchasing power', 'Getting richer'], correct: 2 },
    xp: 60,
  },
  {
    id: 'tax-basics',
    title: 'Tax Basics for Salaried',
    content: 'Income tax in India follows a slab system. You can save tax under Section 80C (up to ₹1.5L) through ELSS, PPF, and LIC. Section 80D covers health insurance premiums. New Tax Regime offers lower rates but fewer deductions.',
    quiz: { question: 'Section 80C max deduction is:', options: ['₹1 Lakh', '₹1.5 Lakh', '₹2 Lakh', '₹50,000'], correct: 1 },
    xp: 70,
  },
  {
    id: 'stock-market',
    title: 'Stock Market Fundamentals',
    content: 'Stocks represent ownership in a company. When you buy Nifty 50 index funds, you\'re buying a basket of India\'s top 50 companies. Historically, Nifty has returned ~12% annually. SIP in index funds is the simplest wealth-building strategy.',
    quiz: { question: 'What does SIP stand for?', options: ['Simple Investment Plan', 'Systematic Investment Plan', 'Stock Investment Plan', 'Savings Investment Plan'], correct: 1 },
    xp: 80,
  },
];

const Academy = () => {
  const [completedLessons, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('kuberx-academy');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const totalXP = lessons.filter(l => completedLessons.has(l.id)).reduce((sum, l) => sum + l.xp, 0);
  const streak = completedLessons.size;

  const answerQuiz = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (activeLesson && index === activeLesson.quiz.correct) {
      const updated = new Set(completedLessons);
      updated.add(activeLesson.id);
      setCompleted(updated);
      localStorage.setItem('kuberx-academy', JSON.stringify([...updated]));
    }
  };

  return (
    <div className="p-8 ml-64">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">Financial Academy</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gold">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">{totalXP} XP</span>
            </div>
            <div className="flex items-center gap-1.5 text-crimson">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{streak} streak</span>
            </div>
          </div>
        </div>

        {!activeLesson ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map(lesson => {
              const done = completedLessons.has(lesson.id);
              return (
                <motion.button
                  key={lesson.id}
                  onClick={() => { setActiveLesson(lesson); setSelectedAnswer(null); setShowResult(false); }}
                  className={`glass-card p-5 text-left transition-all hover:border-primary/50 ${done ? 'border-accent/30' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{lesson.xp} XP</span>
                    {done && <CheckCircle className="w-4 h-4 text-emerald-accent" />}
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{lesson.content.substring(0, 80)}...</p>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <button onClick={() => setActiveLesson(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              ← Back to lessons
            </button>
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">{activeLesson.title}</h2>
              <p className="text-sm text-secondary-foreground leading-relaxed">{activeLesson.content}</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Quiz</h3>
              <p className="text-sm text-muted-foreground mb-4">{activeLesson.quiz.question}</p>
              <div className="space-y-2">
                {activeLesson.quiz.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !showResult && answerQuiz(i)}
                    disabled={showResult}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                      showResult
                        ? i === activeLesson.quiz.correct
                          ? 'bg-accent/10 border-accent/30 text-emerald-accent'
                          : i === selectedAnswer
                            ? 'bg-destructive/10 border-destructive/30 text-crimson'
                            : 'bg-secondary/30 border-border/30 text-muted-foreground'
                        : 'bg-secondary border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {showResult && (
                <p className={`mt-4 text-sm font-medium ${selectedAnswer === activeLesson.quiz.correct ? 'text-emerald-accent' : 'text-crimson'}`}>
                  {selectedAnswer === activeLesson.quiz.correct ? `✅ Correct! +${activeLesson.xp} XP` : '❌ Wrong answer. Try again next time!'}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Academy;
