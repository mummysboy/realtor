import { DynamoDB, SNS } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new DynamoDB.DocumentClient();
const sns = new SNS();

const VIEWINGS_TABLE_NAME = process.env.VIEWINGS_TABLE_NAME || 'ViewingsTable';
const LISTINGS_TABLE_NAME = process.env.LISTINGS_TABLE_NAME || 'ListingsTable';
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || 'arn:aws:sns:us-east-1:123456789012:realitor-notifications';

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

    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { listingId, phone, timeSlot } = JSON.parse(body);

    // Validate required fields
    if (!listingId || !phone || !timeSlot) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Verify the listing exists
    const listingParams = {
      TableName: LISTINGS_TABLE_NAME,
      Key: { id: listingId },
    };

    const listingResult = await dynamodb.get(listingParams).promise();
    if (!listingResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Listing not found' }),
      };
    }

    const viewingId = uuidv4();
    const now = new Date().toISOString();

    // Create the viewing request
    const viewingRequest = {
      id: viewingId,
      listingId,
      phone,
      timeSlot,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    // Save to DynamoDB
    const params = {
      TableName: VIEWINGS_TABLE_NAME,
      Item: viewingRequest,
    };

    await dynamodb.put(params).promise();

    // Send SMS notification
    try {
      const message = `New viewing request for ${listingResult.Item.title} at ${timeSlot}. Phone: ${phone}. Request ID: ${viewingId}`;
      
      const snsParams = {
        TopicArn: SNS_TOPIC_ARN,
        Message: message,
        Subject: 'New Viewing Request',
      };

      await sns.publish(snsParams).promise();
    } catch (snsError) {
      console.error('Error sending SMS notification:', snsError);
      // Don't fail the request if SMS fails
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(viewingRequest),
    };
  } catch (error) {
    console.error('Error creating viewing request:', error);
    
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