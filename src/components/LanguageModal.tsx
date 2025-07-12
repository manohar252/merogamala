import React from 'react';
import { Globe } from '../utils/icons';

interface LanguageModalProps {
  onSelectLanguage: (language: 'en' | 'ne') => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ onSelectLanguage }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform animate-fade-in">
        <div className="mb-6">
          <Globe className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MERO GAMALAA</h2>
          <p className="text-gray-600">Please select your preferred language</p>
          <p className="text-gray-600 mt-1">कृपया आफ्नो मनपर्ने भाषा छान्नुहोस्</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectLanguage('en')}
            className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 text-lg"
          >
            <span className="text-2xl">🇺🇸</span>
            English
          </button>
          
          <button
            onClick={() => onSelectLanguage('ne')}
            className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-4 px-6 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-3 text-lg"
          >
            <span className="text-2xl">🇳🇵</span>
            नेपाली
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;