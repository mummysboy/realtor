import { DynamoDB, S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();
const s3 = new S3();

const LISTINGS_TABLE_NAME = process.env.LISTINGS_TABLE_NAME || 'ListingsTable';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'realitor-media-bucket';

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

    // Parse multipart form data
    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    // For simplicity, we'll expect JSON data for now
    // In a real implementation, you'd parse multipart form data
    const listingData = JSON.parse(body);
    
    const {
      title,
      description,
      rent,
      bedrooms,
      bathrooms,
      sqft,
      address,
      city,
      state,
      zipCode,
      availableTimes,
    } = listingData;

    // Validate required fields
    if (!title || !description || !rent || !address || !city || !state || !zipCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const listingId = uuidv4();
    const now = new Date().toISOString();

    // Create the listing object
    const listing = {
      id: listingId,
      title,
      description,
      rent: parseInt(rent),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseFloat(bathrooms),
      sqft: parseInt(sqft),
      address,
      city,
      state,
      zipCode,
      images: [], // Will be populated after S3 upload
      availableTimes: availableTimes || ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      createdAt: now,
      updatedAt: now,
    };

    // Save to DynamoDB
    const params = {
      TableName: LISTINGS_TABLE_NAME,
      Item: listing,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(listing),
    };
  } catch (error) {
    console.error('Error creating listing:', error);
    
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