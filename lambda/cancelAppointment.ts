import { DynamoDB, SNS } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

    const requestId = event.pathParameters?.id;
    
    if (!requestId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request ID is required' }),
      };
    }

    // Parse the request body to get the message
    let message = '';
    try {
      const body = JSON.parse(event.body || '{}');
      message = body.message || '';
    } catch (error) {
      console.error('Error parsing request body:', error);
    }

    // Get the viewing request
    const getParams = {
      TableName: VIEWINGS_TABLE_NAME,
      Key: { id: requestId },
    };

    const requestResult = await dynamodb.get(getParams).promise();
    
    if (!requestResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Viewing request not found' }),
      };
    }

    const viewingRequest = requestResult.Item;

    // Get the listing details
    const listingParams = {
      TableName: LISTINGS_TABLE_NAME,
      Key: { id: viewingRequest.listingId },
    };

    const listingResult = await dynamodb.get(listingParams).promise();
    const listing = listingResult.Item;

    // Update the viewing request status to canceled
    const updateParams = {
      TableName: VIEWINGS_TABLE_NAME,
      Key: { id: requestId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'canceled',
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateResult = await dynamodb.update(updateParams).promise();

    // Send cancellation SMS
    try {
      const smsMessage = message 
        ? `Your appointment for ${listing?.title || 'the property'} at ${viewingRequest.timeSlot} has been canceled. ${message}`
        : `Your appointment for ${listing?.title || 'the property'} at ${viewingRequest.timeSlot} has been canceled. Please contact us for rescheduling.`;
      
      const snsParams = {
        TopicArn: SNS_TOPIC_ARN,
        Message: smsMessage,
        Subject: 'Appointment Canceled',
      };

      await sns.publish(snsParams).promise();
    } catch (snsError) {
      console.error('Error sending cancellation SMS:', snsError);
      // Don't fail the request if SMS fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updateResult.Attributes),
    };
  } catch (error) {
    console.error('Error canceling appointment:', error);
    
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