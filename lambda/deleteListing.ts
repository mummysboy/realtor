import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.LISTINGS_TABLE_NAME || 'ListingsTable';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Set CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    const listingId = event.pathParameters?.id;
    if (!listingId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Listing ID is required' }),
      };
    }

    // Check if the listing exists
    const getParams = {
      TableName: TABLE_NAME,
      Key: { id: listingId },
    };

    const existingListing = await dynamodb.get(getParams).promise();
    if (!existingListing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Listing not found' }),
      };
    }

    // Delete the listing
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: { id: listingId },
    };

    await dynamodb.delete(deleteParams).promise();

    return {
      statusCode: 204,
      headers,
      body: '',
    };
  } catch (error) {
    console.error('Error deleting listing:', error);
    
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