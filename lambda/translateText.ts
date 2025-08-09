import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getOpenAIClient } from './utils/openai';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Set CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { text } = JSON.parse(body);

    // Validate required fields
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required and must be a non-empty string' }),
      };
    }

    // Check text length limit (prevent abuse)
    if (text.length > 5000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text too long. Maximum 5000 characters allowed.' }),
      };
    }

    try {
      const openai = await getOpenAIClient();
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional real estate translator. Translate the following Hebrew real estate listing description to professional, natural English. Maintain the same tone and style as the original. Format the response as a clean English translation without any additional commentary or formatting.`
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const translation = completion.choices[0]?.message?.content?.trim();
      
      if (!translation) {
        throw new Error('No translation received from OpenAI');
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          translation,
          originalText: text,
          timestamp: new Date().toISOString()
        }),
      };
    } catch (openaiError) {
      console.error('OpenAI translation error:', openaiError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Translation service temporarily unavailable' }),
      };
    }
  } catch (error) {
    console.error('Translation endpoint error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
