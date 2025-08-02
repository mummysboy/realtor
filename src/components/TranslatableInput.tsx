import React, { useState, useRef, useEffect } from 'react';
import { translateText } from '../utils/translation';

interface TranslatableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  type?: string;
  name?: string;
  id?: string;
}

const TranslatableInput: React.FC<TranslatableInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  required = false,
  type = 'text',
  name,
  id,
}) => {
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if text contains Hebrew characters
  const containsHebrew = (text: string) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text);
  };

  // Update translate button visibility
  useEffect(() => {
    const hasHebrew = containsHebrew(value);
    const hasContent = value.trim().length > 0;
    setShowTranslateButton(hasHebrew && hasContent);
  }, [value]);

  const handleTranslate = async () => {
    if (!value.trim() || isTranslating) return;

    try {
      setIsTranslating(true);
      const translation = await translateText(value);
      
      // For input fields, replace the text with the translation
      onChange(translation);
      
      // Focus back on the input
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(translation.length, translation.length);
      }
    } catch (error) {
      console.error('Translation failed:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${className}`}
      />
      
      {showTranslateButton && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`absolute top-1/2 right-3 transform -translate-y-1/2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            isTranslating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
          }`}
        >
          {isTranslating ? (
            <div className="flex items-center">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              Translating...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Translate
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default TranslatableInput; 