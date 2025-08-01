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
      'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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

    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const updateData = JSON.parse(body);
    const now = new Date().toISOString();

    // Get the existing listing first
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

    // Update the listing with new data
    const updatedListing = {
      ...existingListing.Item,
      ...updateData,
      // Ensure images are properly handled
      images: updateData.images && updateData.images.length > 0 ? updateData.images : existingListing.Item.images,
      updatedAt: now,
    };

    const updateParams = {
      TableName: TABLE_NAME,
      Item: updatedListing,
    };

    await dynamodb.put(updateParams).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedListing),
    };
  } catch (error) {
    console.error('Error updating listing:', error);
    
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