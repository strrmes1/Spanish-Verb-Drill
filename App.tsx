
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Verb, Tense, Pronoun, SessionStats } from './types';
import { VERBS } from './data/verbs';
import Navigation from './components/Navigation';
import ProgressBar from './components/ProgressBar';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.MAIN);
  const [showTenseSelector, setShowTenseSelector] = useState(false);
  const [selectedTenses, setSelectedTenses] = useState<Tense[]>([Tense.PRESENTE]);
  const [selectedVerbIds, setSelectedVerbIds] = useState<string[]>(VERBS.map(v => v.id));
  const [cardCount, setCardCount] = useState<number>(20);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Game State
  const [currentCard, setCurrentCard] = useState<{
    verb: Verb;
    tense: Tense;
    pronoun: Pronoun;
    answer: string;
  } | null>(null);
  
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [stats, setStats] = useState<SessionStats>(() => {
    const saved = localStorage.getItem('drill_stats');
    return saved ? JSON.parse(saved) : { correct: 0, incorrect: 0, totalAnswered: 0 };
  });

  useEffect(() => {
    localStorage.setItem('drill_stats', JSON.stringify(stats));
  }, [stats]);

  const generateNewCard = useCallback(() => {
    const activeVerbs = VERBS.filter(v => selectedVerbIds.includes(v.id));
    if (activeVerbs.length === 0 || selectedTenses.length === 0) return;

    const randomVerb = activeVerbs[Math.floor(Math.random() * activeVerbs.length)];
    const randomTense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
    const pronouns = Object.values(Pronoun);
    const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    
    setCurrentCard({
      verb: randomVerb,
      tense: randomTense,
      pronoun: randomPronoun,
      answer: (randomVerb.conjugations as any)[randomTense][randomPronoun]
    });
    setFeedback(null);
    setUserInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [selectedTenses, selectedVerbIds]);

  useEffect(() => {
    if (!currentCard && activeView === View.MAIN && !showTenseSelector) generateNewCard();
  }, [currentCard, generateNewCard, activeView, showTenseSelector]);

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentCard || feedback || !userInput.trim()) return;

    const isCorrect = userInput.trim().toLowerCase() === currentCard.answer.toLowerCase();
    
    if (isCorrect) {
      setFeedback('correct');
      setStats(prev => ({
        ...prev,
        correct: prev.correct + 1,
        totalAnswered: prev.totalAnswered + 1
      }));
    } else {
      setFeedback('incorrect');
      setStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        totalAnswered: prev.totalAnswered + 1
      }));
    }
  };

  const handleNext = () => {
    generateNewCard();
  };

  const toggleTense = (tense: Tense) => {
    setSelectedTenses(prev => 
      prev.includes(tense) 
        ? (prev.length > 1 ? prev.filter(t => t !== tense) : prev)
        : [...prev, tense]
    );
  };

  const toggleVerb = (id: string) => {
    setSelectedVerbIds(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(vid => vid !== id) : prev)
        : [...prev, id]
    );
  };

  const renderMain = () => {
    if (showTenseSelector) {
      return (
        <div className="max-w-md mx-auto p-4 pb-24">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">Tenses</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select grammatical times</p>
            </div>
            <button 
              onClick={() => setShowTenseSelector(false)}
              className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined font-black">close</span>
            </button>
          </div>
          
          <div className="grid gap-3">
            {Object.values(Tense).map(t => (
              <button 
                key={t} 
                onClick={() => toggleTense(t)}
                className={`w-full bg-white p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between group text-left ${
                  selectedTenses.includes(t) ? 'border-primary shadow-lg shadow-primary/5' : 'border-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${
                    selectedTenses.includes(t) ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <span className="material-symbols-outlined">{t === Tense.PRESENTE ? 'schedule' : t === Tense.PRETERITO ? 'history' : 'update'}</span>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">{t}</p>
                    <p className="text-xs font-bold text-gray-400">Practicing {t.toLowerCase()} form</p>
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedTenses.includes(t) ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                }`}>
                  {selectedTenses.includes(t) && <span className="material-symbols-outlined text-[16px] text-white font-black">check</span>}
                </div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowTenseSelector(false)}
            className="w-full mt-8 py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 active:scale-95 transition-transform"
          >
            CONFIRM SELECTION
          </button>
        </div>
      );
    }

    const hasSelectedVerbs = selectedVerbIds.length > 0;

    return (
      <div className="flex flex-col min-h-[calc(100vh-140px)] max-w-md mx-auto p-4 pt-4">
        {/* Drill Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setShowTenseSelector(true)}
            className="flex-1 flex items-center justify-center gap-3 bg-[#e8f4fe] border border-blue-100 rounded-[1.5rem] py-3 px-5 transition-all hover:brightness-95 active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-primary font-bold text-[24px]">checklist</span>
            <span className="text-primary font-black text-lg tracking-tight">Tenses</span>
          </button>
          
          <div className="relative flex-1">
            <select 
              value={cardCount} 
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full appearance-none bg-white border border-gray-100 rounded-[1.5rem] px-5 py-3.5 text-xs font-black uppercase tracking-wider focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer shadow-sm"
            >
              <option value={10}>10 Cards</option>
              <option value={20}>20 Cards</option>
              <option value={50}>50 Cards</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400">expand_more</span>
          </div>
        </div>

        {!hasSelectedVerbs ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">list_alt</span>
            <h3 className="text-xl font-black text-gray-900 mb-2">No verbs selected</h3>
            <p className="text-sm text-gray-400 mb-6">Go to the Verb List to select verbs for practice.</p>
            <button 
              onClick={() => setActiveView(View.TYPES)}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              Go to Verb List
            </button>
          </div>
        ) : currentCard && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Flashcard */}
            <div className={`relative bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-500/10 border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] ${
              feedback === 'correct' ? 'border-emerald-500' : 
              feedback === 'incorrect' ? 'border-rose-500' : 
              'border-gray-100'
            }`}>
              <div className="absolute top-8 flex items-center gap-2">
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Verb Conjugation</span>
                {!currentCard.verb.isRegular && (
                  <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Irregular</span>
                )}
              </div>
              
              <h2 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">{currentCard.verb.infinitive}</h2>
              <p className="text-sm font-medium text-gray-400 mb-8 italic">{currentCard.verb.translation}</p>
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                <div className="bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Subject</span>
                  <span className="text-base font-bold text-blue-700">{currentCard.pronoun}</span>
                </div>
                <div className="bg-purple-50/50 rounded-2xl p-4 flex flex-col items-center text-center">
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-1">Tense</span>
                  <span className="text-sm font-bold text-purple-700 leading-tight">{currentCard.tense.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleCheck} className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => !feedback && setUserInput(e.target.value)}
                disabled={!!feedback}
                placeholder="Enter conjugation..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className={`w-full h-20 rounded-[1.5rem] px-8 text-2xl font-bold focus:outline-none transition-all border-4 text-center ${
                  feedback === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' :
                  feedback === 'incorrect' ? 'border-rose-500 bg-rose-50 text-rose-900' :
                  'border-gray-100 bg-white shadow-xl shadow-blue-500/5 focus:border-primary focus:scale-[1.02]'
                }`}
              />
              {feedback ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 h-12 px-6 flex items-center justify-center rounded-2xl font-black text-sm text-white shadow-lg transform transition-all active:scale-90 hover:brightness-110 ${
                    feedback === 'correct' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'
                  }`}
                >
                  NEXT <span className="material-symbols-outlined ml-2 font-bold">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-2xl shadow-lg transform transition-all active:scale-90 ${
                    userInput.trim() ? 'bg-primary text-white shadow-primary/30' : 'bg-gray-100 text-gray-300 shadow-none'
                  }`}
                >
                  <span className="material-symbols-outlined font-black">check</span>
                </button>
              )}
            </form>

            {/* Feedback Box */}
            {feedback === 'incorrect' && (
              <div className="p-5 bg-white border-2 border-rose-100 rounded-[1.5rem] flex items-center justify-between shadow-lg shadow-rose-500/5 animate-bounce-short">
                 <div className="flex items-center gap-3">
                   <div className="bg-rose-100 p-2 rounded-xl text-rose-500">
                      <span className="material-symbols-outlined font-black">close</span>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Correct Answer</p>
                      <p className="text-xl font-black text-rose-600 tracking-tight">{currentCard.answer}</p>
                   </div>
                 </div>
              </div>
            )}

            {/* Rules Section */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-[1.5rem] p-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <span className="material-symbols-outlined text-[20px] font-bold">menu_book</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">Conjugation Rule</h4>
                  <p className="text-sm text-amber-800 font-medium leading-relaxed italic">
                    "{currentCard.verb.rules}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Progress Bar */}
        <div className="mt-auto pt-8 pb-10">
          <ProgressBar correct={stats.correct} incorrect={stats.incorrect} total={cardCount} />
        </div>
      </div>
    );
  };

  const renderTypes = () => (
    <div className="max-w-md mx-auto p-4 pb-24">
      <div className="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">Selection</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pick Verbs for Practice</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-primary text-white px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase">
            {selectedVerbIds.length} Active
          </div>
          <button 
            onClick={() => setSelectedVerbIds(selectedVerbIds.length === VERBS.length ? [VERBS[0].id] : VERBS.map(v => v.id))}
            className="text-[9px] font-black text-primary uppercase tracking-widest underline"
          >
            {selectedVerbIds.length === VERBS.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
      
      <div className="grid gap-3">
        {VERBS.map(v => (
          <button 
            key={v.id} 
            onClick={() => toggleVerb(v.id)}
            className={`w-full bg-white p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between group text-left ${
              selectedVerbIds.includes(v.id) ? 'border-primary shadow-lg shadow-primary/5' : 'border-gray-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${
                selectedVerbIds.includes(v.id) ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'
              }`}>
                {v.infinitive.slice(-2).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">{v.infinitive}</p>
                <p className="text-sm font-bold text-gray-400">{v.translation}</p>
              </div>
            </div>
            
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedVerbIds.includes(v.id) ? 'bg-primary border-primary' : 'bg-white border-gray-200'
            }`}>
              {selectedVerbIds.includes(v.id) && <span className="material-symbols-outlined text-[16px] text-white font-black">check</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSett = () => {
    const accuracy = stats.totalAnswered > 0 ? Math.round((stats.correct / stats.totalAnswered) * 100) : 0;
    return (
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="mb-10 px-2">
          <h2 className="text-3xl font-black text-gray-900 mb-1 leading-none">Your Stats</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Personal History</p>
        </div>
        
        <div className="grid grid-cols-2 gap-5 mb-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5 flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined font-black">bolt</span>
            </div>
            <span className="text-3xl font-black text-gray-900 mb-1 leading-none">{accuracy}%</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precision</span>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5 flex flex-col items-center">
             <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                <span className="material-symbols-outlined font-black">history_edu</span>
              </div>
            <span className="text-3xl font-black text-gray-900 mb-1 leading-none">{stats.totalAnswered}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Answered</span>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-gray-900/20 mb-10 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Correct Strikes</span>
              <span className="text-xl font-black text-emerald-400">{stats.correct}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${accuracy}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Failed Attempts</span>
              <span className="text-xl font-black text-rose-400">{stats.incorrect}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setStats({ correct: 0, incorrect: 0, totalAnswered: 0 })}
          className="w-full py-5 text-rose-500 font-black text-xs bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all uppercase tracking-widest active:scale-95"
        >
          Reset Session Stats
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-[22px] font-black">exercise</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-gray-900">VERB DRILLS</h1>
            <span className="text-[9px] font-black text-primary tracking-[0.3em] uppercase">Mastery Tools</span>
          </div>
        </div>
      </header>

      <main className="pb-10">
        {activeView === View.MAIN && renderMain()}
        {activeView === View.TYPES && renderTypes()}
        {activeView === View.SETT && renderSett()}
      </main>

      <Navigation activeView={activeView} onViewChange={setActiveView} />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
