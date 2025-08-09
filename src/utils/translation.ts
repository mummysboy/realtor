import { api } from './api';

export const translateText = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for translation');
  }

  // Check text length limit
  if (text.length > 5000) {
    throw new Error('Text too long. Maximum 5000 characters allowed.');
  }

  try {
    return await api.translateText(text.trim());
  } catch (error) {
    console.error('Translation error:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to translate text. Please check your connection and try again.');
    }
  }
}; 