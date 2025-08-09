import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getOpenAIClient } from './utils/openai';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  try {
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

    const { text, propertyType } = JSON.parse(body);

    // Validate required fields
    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    console.log('✨ Enhancing description:', text.substring(0, 100) + '...');
    
    // Generate enhanced description using OpenAI
    const client = await getOpenAIClient();

    const prompt = `You are a professional real estate copywriter. Please enhance and improve the following ${propertyType || 'property'} listing description. 

ORIGINAL TEXT:
"${text}"

INSTRUCTIONS:
1. Correct any grammar, spelling, or punctuation errors
2. Improve sentence structure and flow
3. Make the language more engaging and professional
4. Add compelling adjectives where appropriate
5. Ensure proper formatting and readability
6. Maintain the original meaning and key information
7. Keep it concise and focused on what attracts renters
8. Use professional real estate language

IMPORTANT:
- Do NOT add any information that wasn't in the original text
- Do NOT make up specific features, amenities, or details
- Do NOT change factual information like prices, sizes, or locations
- Only improve the writing quality and presentation
- Return ONLY the enhanced description, no explanations

Enhanced description:`;

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert real estate copywriter who enhances property descriptions by improving grammar, style, and readability while preserving all original facts and information. You make text more compelling without adding false details."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const enhancedDescription = completion.choices[0]?.message?.content || 'Unable to enhance description';

      console.log('✨ Enhanced description generated successfully');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          enhancedDescription: enhancedDescription.trim(),
          originalText: text 
        }),
      };
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to enhance description using AI' }),
      };
    }
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
