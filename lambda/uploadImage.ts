import { S3 } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3();
const BUCKET_NAME = 'realitor-media-bucket';

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

    const { imageData, fileName, contentType } = JSON.parse(body);

    if (!imageData || !fileName || !contentType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: imageData, fileName, contentType' }),
      };
    }

    try {
      // Decode base64 image data
      console.log('Lambda: Decoding base64 image data...');
      const imageBuffer = Buffer.from(imageData, 'base64');
      console.log('Lambda: Image buffer size:', imageBuffer.length);
      
      // Generate unique filename
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      console.log('Lambda: Generated filename:', uniqueFileName);
      
      // Upload to S3 (without ACL since the bucket doesn't support it)
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `listings/${uniqueFileName}`,
        Body: imageBuffer,
        ContentType: contentType,
      };
      
      console.log('Lambda: Uploading to S3 with params:', {
        Bucket: uploadParams.Bucket,
        Key: uploadParams.Key,
        ContentType: uploadParams.ContentType,
      });

      const uploadResult = await s3.upload(uploadParams).promise();
      console.log('Lambda: Upload successful, location:', uploadResult.Location);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          imageUrl: uploadResult.Location,
          fileName: uniqueFileName,
        }),
      };
    } catch (error) {
      console.error('Lambda: Error during processing:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    
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