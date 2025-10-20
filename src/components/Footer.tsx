import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-red-500" /> using Cursor
        </p>
      </div>
    </footer>
  );
};
