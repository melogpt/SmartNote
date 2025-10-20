import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, HelpCircle, CreditCard, Loader2, RotateCcw } from 'lucide-react';
import { TabType, QuizQuestion, Flashcard } from '../types';

interface ResultsSectionProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  results: {
    summary?: string;
    quiz?: QuizQuestion[];
    flashcards?: Flashcard[];
  };
  isLoading: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  activeTab,
  setActiveTab,
  results,
  isLoading
}) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const tabs = [
    { id: 'summary' as TabType, label: 'Summary', icon: FileText },
    { id: 'quiz' as TabType, label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards' as TabType, label: 'Flashcards', icon: CreditCard }
  ];

  const handleCardFlip = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const hasResults = Object.values(results).some(result => result && (Array.isArray(result) ? result.length > 0 : result));

  if (!hasResults && !isLoading) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasData = results[tab.id] && (Array.isArray(results[tab.id]) ? (results[tab.id] as any[]).length > 0 : results[tab.id]);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                isActive
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              } ${!hasData ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!hasData}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Generating your {activeTab}...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'summary' && results.summary && (
                <div className="prose max-w-none">
                  <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-primary">
                    <h3 className="text-lg font-semibold text-primary mb-3">Summary</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {results.summary}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && results.quiz && results.quiz.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Quiz Questions</h3>
                  {results.quiz.map((question, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              question.correctAnswer === optionIndex
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}. {option}
                            {question.correctAnswer === optionIndex && (
                              <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'flashcards' && results.flashcards && results.flashcards.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary mb-4">Flashcards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.flashcards.map((card, index) => (
                      <motion.div
                        key={index}
                        className="relative h-48 cursor-pointer"
                        onClick={() => handleCardFlip(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                          flippedCards.has(index) ? 'rotate-y-180' : ''
                        }`}>
                          <div className="absolute inset-0 backface-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-xl p-6 flex flex-col justify-center items-center text-white shadow-lg">
                              <div className="text-center mb-4">
                                <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                                <p className="text-sm opacity-80">Click to reveal</p>
                              </div>
                              <p className="text-center font-medium">
                                {card.front}
                              </p>
                            </div>
                          </div>
                          <div className="absolute inset-0 backface-hidden rotate-y-180">
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-purple-600 rounded-xl p-6 flex flex-col justify-center items-center text-white shadow-lg">
                              <div className="text-center mb-4">
                                <RotateCcw className="w-6 h-6 mx-auto mb-2" />
                                <p className="text-sm opacity-80">Answer</p>
                              </div>
                              <p className="text-center font-medium">
                                {card.back}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
