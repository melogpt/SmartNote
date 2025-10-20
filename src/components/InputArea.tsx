import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, HelpCircle, CreditCard, Loader2, Upload, File } from 'lucide-react';
import { generateSummary, generateQuiz, generateFlashcards, listAvailableModels } from '../utils/gemini';
import { extractTextFromPDF, isPDFFile } from '../utils/pdfParser';

interface InputAreaProps {
  onResultsUpdate: (type: 'summary' | 'quiz' | 'flashcards', data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
  onResultsUpdate, 
  isLoading, 
  setIsLoading 
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleListModels = async () => {
    try {
      await listAvailableModels();
    } catch (error) {
      console.error('Error listing models:', error);
    }
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isPDFFile(file)) {
      alert('Please select a valid PDF file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('PDF file size must be less than 10MB.');
      return;
    }

    setIsProcessingPDF(true);
    setUploadedFileName(file.name);

    try {
      const extractedText = await extractTextFromPDF(file);
      setInputText(extractedText);
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      alert('Failed to extract text from PDF. Please try again.');
    } finally {
      setIsProcessingPDF(false);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (type: 'summary' | 'quiz' | 'flashcards') => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      let result;
      switch (type) {
        case 'summary':
          result = await generateSummary(inputText);
          break;
        case 'quiz':
          result = await generateQuiz(inputText);
          break;
        case 'flashcards':
          result = await generateFlashcards(inputText);
          break;
        default:
          return;
      }
      onResultsUpdate(type, result);
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      alert(`Error generating ${type}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text mb-4">
          Transform Your Notes into Study Materials
        </h2>
        <p className="text-gray-600 text-lg">
          Paste your study notes below or upload a PDF file and let AI help you create summaries, quizzes, and flashcards
        </p>
      </div>

      <div className="mb-6">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your notes here... (e.g., lecture notes, textbook content, research papers)"
          className="w-full h-48 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700"
          disabled={isLoading || isProcessingPDF}
        />
        
        {/* PDF Upload Section */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFileButtonClick}
              disabled={isProcessingPDF || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isProcessingPDF ? 'Processing...' : 'Upload PDF'}
            </motion.button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              className="hidden"
            />
            
            {uploadedFileName && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <File className="w-4 h-4" />
                <span>{uploadedFileName}</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            Max 10MB PDF files
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubmit('summary')}
          disabled={isLoading || !inputText.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Summarize
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubmit('quiz')}
          disabled={isLoading || !inputText.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <HelpCircle className="w-5 h-5" />
          )}
          Create Quiz
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSubmit('flashcards')}
          disabled={isLoading || !inputText.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          Generate Flashcards
        </motion.button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleListModels}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          List Available Models (Check Console)
        </button>
      </div>
    </div>
  );
};
