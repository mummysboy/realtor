import React, { useState, useRef, useEffect } from 'react';
import { translateText } from '../utils/translation';

interface TranslatableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  required?: boolean;
}

const TranslatableTextarea: React.FC<TranslatableTextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  required = false,
}) => {
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      
      // Append the English translation to the existing text
      const separator = '\n\n--- English Translation ---\n\n';
      const newValue = value + separator + translation;
      onChange(newValue);
      
      // Focus back on the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newValue.length, newValue.length);
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
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none ${className}`}
      />
      
      {showTranslateButton && (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
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

export default TranslatableTextarea; 