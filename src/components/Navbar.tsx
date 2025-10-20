import React from 'react';
import { BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text">SmartStudy</h1>
            <p className="text-sm text-gray-600">AI Study Assistant</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
