import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { InputArea } from './components/InputArea';
import { ResultsSection } from './components/ResultsSection';
import { Footer } from './components/Footer';

type TabType = 'summary' | 'quiz' | 'flashcards';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [results, setResults] = useState<{
    summary?: string;
    quiz?: any[];
    flashcards?: any[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleResultsUpdate = (type: TabType, data: any) => {
    setResults(prev => ({
      ...prev,
      [type]: data
    }));
    setActiveTab(type);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <InputArea 
            onResultsUpdate={handleResultsUpdate}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <ResultsSection 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            results={results}
            isLoading={isLoading}
          />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
