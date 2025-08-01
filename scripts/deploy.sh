#!/bin/bash

# Realitor Deployment Script
# This script deploys the entire application to AWS

set -e

echo "🚀 Starting Realitor deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo "❌ AWS CDK is not installed. Please install it with 'npm install -g aws-cdk'"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install frontend dependencies
npm install

# Install and build Lambda functions
cd lambda
npm install
npm run build
cd ..

# Install infrastructure dependencies
cd infrastructure
npm install
cd ..

echo "🏗️  Deploying AWS infrastructure..."

# Deploy infrastructure
cd infrastructure

# Bootstrap CDK if needed
if ! aws cloudformation describe-stacks --stack-name CDKToolkit &> /dev/null; then
    echo "🔧 Bootstrapping CDK..."
    cdk bootstrap
fi

# Deploy the stack
echo "🚀 Deploying Realitor stack..."
cdk deploy --require-approval never

# Get the API Gateway URL
API_URL=$(aws cloudformation describe-stacks --stack-name RealitorStack --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' --output text)

echo "✅ Infrastructure deployed successfully!"
echo "🌐 API Gateway URL: $API_URL"

cd ..

# Create .env file with the API URL
echo "📝 Creating .env file..."
cat > .env << EOF
REACT_APP_API_URL=$API_URL
EOF

echo "✅ Deployment complete!"
echo ""
echo "🎉 Your Realitor app is now deployed!"
echo "📱 Frontend: Run 'npm start' to start the development server"
echo "🔧 Backend: API Gateway URL is $API_URL"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm start' to start the development server"
echo "2. Visit http://localhost:3000 to see your app"
echo "3. Go to /admin to create your first listing"
echo "4. Configure SMS notifications in AWS SNS console" 