
import React from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
  disabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage, disabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = event.target.value;
    const language = LANGUAGES.find(l => l.code === langCode);
    if (language) {
      onSelectLanguage(language);
    }
  };

  return (
    <div className="relative">
      <select
        value={selectedLanguage.code}
        onChange={handleChange}
        disabled={disabled}
        className="appearance-none block w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-teal-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
