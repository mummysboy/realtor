import { SSM } from 'aws-sdk';
import OpenAI from 'openai';

// SSM client for accessing Parameter Store
const ssm = new SSM();

let openaiClient: OpenAI | null = null;
let apiKey: string | null = null;

/**
 * Retrieves the OpenAI API key from AWS Systems Manager Parameter Store
 * Uses caching to avoid repeated API calls
 */
async function getOpenAIApiKey(): Promise<string> {
  if (apiKey) {
    return apiKey;
  }

  const parameterName = process.env.OPENAI_API_KEY_PARAMETER_NAME;
  if (!parameterName) {
    throw new Error('OPENAI_API_KEY_PARAMETER_NAME environment variable not set');
  }

  try {
    const result = await ssm.getParameter({
      Name: parameterName,
      WithDecryption: true, // This decrypts SecureString parameters
    }).promise();

    if (!result.Parameter?.Value) {
      throw new Error('OpenAI API key not found in Parameter Store');
    }

    apiKey = result.Parameter.Value;
    return apiKey;
  } catch (error) {
    console.error('Error retrieving OpenAI API key:', error);
    throw new Error('Failed to retrieve OpenAI API key from Parameter Store');
  }
}

/**
 * Gets an initialized OpenAI client instance
 * Uses caching to reuse the same client across invocations
 */
export async function getOpenAIClient(): Promise<OpenAI> {
  if (openaiClient) {
    return openaiClient;
  }

  const key = await getOpenAIApiKey();
  openaiClient = new OpenAI({
    apiKey: key,
  });

  return openaiClient;
}

/**
 * Example function showing how to use OpenAI in your Lambda functions
 */
export async function generateListingDescription(
  propertyDetails: {
    type: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    location: string;
    features?: string[];
  }
): Promise<string> {
  const client = await getOpenAIClient();

  const prompt = `Generate an engaging rental listing description for a ${propertyDetails.type} in ${propertyDetails.location}. 
    Details:
    - ${propertyDetails.bedrooms} bedrooms, ${propertyDetails.bathrooms} bathrooms
    - ${propertyDetails.sqft} square feet
    ${propertyDetails.features ? `- Features: ${propertyDetails.features.join(', ')}` : ''}
    
    Write a compelling, professional description that would attract potential renters. Keep it concise but appealing.`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate copywriter specializing in rental listings."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate description';
  } catch (error) {
    console.error('Error generating listing description:', error);
    throw new Error('Failed to generate listing description');
  }
}
