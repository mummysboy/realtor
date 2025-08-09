# OpenAI Integration Setup Guide

This guide explains how to securely configure OpenAI API access in your AWS-hosted Realitor application.

## Overview

The application uses AWS Systems Manager Parameter Store to securely store the OpenAI API key, which is then accessed by Lambda functions at runtime. This approach ensures:

- ✅ Secrets are encrypted at rest
- ✅ Access is controlled via IAM permissions
- ✅ Keys are not stored in code or environment variables in plain text
- ✅ Automatic rotation support (if needed)

## Setup Steps

### 1. Store Your OpenAI API Key in Parameter Store

Before deploying your application, you need to store your OpenAI API key in AWS Systems Manager Parameter Store:

```bash
# Replace 'your-actual-openai-api-key' with your real API key
aws ssm put-parameter \
  --name "/realitor/openai/api-key" \
  --value "your-actual-openai-api-key" \
  --type "SecureString" \
  --description "OpenAI API key for Realitor application"
```

**Important Notes:**
- Get your API key from: https://platform.openai.com/api-keys
- The parameter name must be exactly `/realitor/openai/api-key`
- Use `SecureString` type for encryption
- Make sure you have the necessary AWS CLI permissions

### 2. Deploy Your Infrastructure

After storing the API key, deploy your CDK stack:

```bash
cd infrastructure
npm install
cdk deploy
```

The CDK stack will automatically:
- Reference the parameter store value
- Grant Lambda functions permission to read the parameter
- Set the parameter name in environment variables

### 3. Install Lambda Dependencies

Install the OpenAI SDK in your Lambda layer:

```bash
cd lambda
npm install
npm run build
```

### 4. Using OpenAI in Lambda Functions

Import and use the OpenAI utility in your Lambda functions:

```typescript
import { getOpenAIClient, generateListingDescription } from './utils/openai';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Example 1: Get the OpenAI client directly
    const openai = await getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello!" }]
    });

    // Example 2: Use the pre-built listing description generator
    const description = await generateListingDescription({
      type: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1000,
      location: "Downtown NYC",
      features: ["hardwood floors", "balcony", "parking"]
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ description }),
    };
  } catch (error) {
    console.error('Error:', error);
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
```

## Security Best Practices

1. **Principle of Least Privilege**: Only the Lambda functions that need OpenAI access have permission to read the parameter.

2. **Parameter Encryption**: The API key is stored as a `SecureString` and encrypted using AWS KMS.

3. **No Hardcoding**: The API key is never stored in code, environment files, or plain text.

4. **Caching**: The utility caches the API key in memory during Lambda execution to reduce Parameter Store calls.

5. **Error Handling**: Proper error handling ensures that API key retrieval failures don't expose sensitive information.

## Alternative Approaches

### Option 1: AWS Secrets Manager (Higher Cost)
If you prefer AWS Secrets Manager over Parameter Store:

```typescript
import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager();

async function getOpenAIApiKeyFromSecrets(): Promise<string> {
  const result = await secretsManager.getSecretValue({
    SecretId: 'realitor/openai-api-key'
  }).promise();
  
  return JSON.parse(result.SecretString!).apiKey;
}
```

### Option 2: Environment Variables (Less Secure)
For development only, you could use environment variables:

```typescript
// In your CDK stack (NOT recommended for production)
environment: {
  OPENAI_API_KEY: 'your-api-key', // DON'T DO THIS IN PRODUCTION
}
```

## Troubleshooting

### "Parameter not found" Error
- Verify the parameter exists: `aws ssm get-parameter --name "/realitor/openai/api-key"`
- Check the parameter name spelling
- Ensure you're in the correct AWS region

### "Access Denied" Error
- Verify your Lambda execution role has `ssm:GetParameter` permission
- Check that the CDK deployment completed successfully
- Review IAM roles in the AWS Console

### "OpenAI API Error"
- Verify your API key is valid on the OpenAI platform
- Check your OpenAI account billing and usage limits
- Review OpenAI API status page

## Cost Considerations

- **Parameter Store**: Free for standard parameters, $0.05 per 10,000 API calls for advanced parameters
- **OpenAI API**: Costs vary by model and usage (see OpenAI pricing)
- **Lambda**: Pay per request and compute time

## Environment-Specific Configuration

For different environments (dev, staging, prod), use different parameter paths:

```typescript
const env = process.env.ENVIRONMENT || 'dev';
const parameterName = `/realitor/${env}/openai/api-key`;
```

This setup ensures your OpenAI integration is secure, scalable, and follows AWS best practices!
