import React, { useState, useRef, useEffect } from 'react';
import { translateText } from '../utils/translation';
import { api } from '../utils/api';

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
  const [showEnhanceButton, setShowEnhanceButton] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if text contains Hebrew characters
  const containsHebrew = (text: string) => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text);
  };

  // Check if text is primarily English (basic detection)
  const isEnglishText = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText.length < 10) return false; // Need minimum content for enhancement
    
    // Check if text contains mostly English characters and no Hebrew
    const englishRegex = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
    const hasBasicEnglish = /[a-zA-Z]/.test(trimmedText);
    const noHebrew = !containsHebrew(trimmedText);
    
    return hasBasicEnglish && noHebrew && trimmedText.length >= 10;
  };

  // Update button visibility
  useEffect(() => {
    const hasHebrew = containsHebrew(value);
    const isEnglish = isEnglishText(value);
    const hasContent = value.trim().length > 0;
    
    setShowTranslateButton(hasHebrew && hasContent);
    setShowEnhanceButton(isEnglish && hasContent && !hasHebrew);
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

  const handleEnhance = async () => {
    if (!value.trim() || isEnhancing) return;

    try {
      setIsEnhancing(true);
      const enhancedText = await api.enhanceDescription(value, 'property');
      
      // Replace the existing text with the enhanced version
      onChange(enhancedText);
      
      // Focus back on the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(enhancedText.length, enhancedText.length);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Enhancement failed. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none ${className}`}
      />
      
      {/* Buttons Container - Bottom Right */}
      {(showTranslateButton || showEnhanceButton) && (
        <div className="flex justify-end">
          {/* Translate Button (for Hebrew text) */}
          {showTranslateButton && (
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isTranslating}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all touch-manipulation ${
                isTranslating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md active:bg-primary-700'
              }`}
            >
              {isTranslating ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                  <span className="hidden sm:inline">Translating...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Translate
                </div>
              )}
            </button>
          )}

          {/* Enhance Button (for English text) */}
          {showEnhanceButton && (
            <button
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all touch-manipulation ${
                isEnhancing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-sm hover:shadow-md active:from-purple-700 active:to-pink-700'
              }`}
            >
              {isEnhancing ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                  <span className="hidden sm:inline">Enhancing...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="hidden sm:inline">✨ Enhance with AI</span>
                  <span className="sm:hidden">✨ AI</span>
                </div>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslatableTextarea; 