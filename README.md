# Realitor - Rental Listing Web App

A modern rental listing web application built with React, TypeScript, TailwindCSS, and AWS serverless backend.

## Features

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: AWS Lambda + API Gateway + DynamoDB + S3 + SNS
- **Mobile-first responsive design**
- **Real-time SMS notifications**
- **Admin dashboard for listing management**

## Project Structure

```
realitor-site/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # API utilities
├── lambda/                # AWS Lambda functions
├── infrastructure/        # AWS CDK infrastructure
├── public/               # Static assets
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- AWS CDK installed globally: `npm install -g aws-cdk`

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install infrastructure dependencies
cd infrastructure
npm install
cd ..
```

### 2. Deploy AWS Infrastructure

```bash
cd infrastructure

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy the infrastructure
cdk deploy

# Note the API Gateway URL from the output
```

### 3. Configure Frontend

Update the API URL in `src/utils/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'YOUR_API_GATEWAY_URL';
```

### 4. Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:3000`

## AWS Infrastructure

The application uses the following AWS services:

- **API Gateway**: REST API endpoints
- **Lambda**: Serverless functions for business logic
- **DynamoDB**: NoSQL database for listings and viewing requests
- **S3**: Media storage for listing images
- **SNS**: SMS notifications for viewing requests

### Lambda Functions

- `getListings`: Retrieve all listings
- `getListingById`: Get specific listing details
- `createListing`: Create new listing (admin only)
- `createViewingRequest`: Submit viewing request and send SMS
- `getViewingRequests`: Get all viewing requests (admin)
- `approveViewingRequest`: Approve request and send confirmation SMS

## API Endpoints

```
GET    /listings                    # Get all listings
GET    /listings/{id}              # Get specific listing
POST   /listings                   # Create new listing
GET    /viewing-requests           # Get all viewing requests
POST   /viewing-requests           # Create viewing request
PUT    /viewing-requests/{id}/approve  # Approve viewing request
```

## Frontend Routes

- `/`: Home page with all listings
- `/listing/{id}`: Individual listing details
- `/admin`: Admin dashboard
- `/success`: Success page after viewing request

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

## Deployment

### Frontend Deployment

Build the production version:

```bash
npm run build
```

Deploy the `build` folder to your preferred hosting service (Netlify, Vercel, AWS S3, etc.).

### Backend Deployment

The backend is deployed using AWS CDK:

```bash
cd infrastructure
cdk deploy
```

## SMS Configuration

To enable SMS notifications:

1. Create an SNS topic in AWS Console
2. Subscribe phone numbers to the topic
3. Update the `SNS_TOPIC_ARN` environment variable in the Lambda functions

## Development

### Adding New Features

1. **Frontend**: Add components in `src/components/` and pages in `src/pages/`
2. **Backend**: Add Lambda functions in `lambda/` and update infrastructure
3. **API**: Update API Gateway configuration in `infrastructure/lib/realitor-stack.ts`

### Testing

```bash
# Run frontend tests
npm test

# Run with coverage
npm test -- --coverage
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API Gateway CORS settings are correct
2. **Lambda Timeout**: Increase timeout in infrastructure configuration
3. **SMS Not Working**: Verify SNS topic ARN and phone number subscriptions

### Debugging

- Check CloudWatch logs for Lambda function errors
- Use AWS X-Ray for tracing
- Monitor API Gateway logs for request/response issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository. 