const API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

export const translateText = async (text: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional real estate translator. Translate the following Hebrew real estate listing description to professional, natural English. Maintain the same tone and style as the original. Format the response as a clean English translation without any additional commentary or formatting.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}; 