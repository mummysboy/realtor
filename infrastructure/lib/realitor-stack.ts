import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class RealitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for media storage
    const mediaBucket = new s3.Bucket(this, 'RealitorMediaBucket', {
      bucketName: 'realitor-media-bucket',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // DynamoDB Tables
    const listingsTable = new dynamodb.Table(this, 'ListingsTable', {
      tableName: 'ListingsTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const viewingsTable = new dynamodb.Table(this, 'ViewingsTable', {
      tableName: 'ViewingsTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // SNS Topic for notifications
    const notificationsTopic = new sns.Topic(this, 'RealitorNotificationsTopic', {
      topicName: 'realitor-notifications',
    });

    // Lambda Functions
    const commonLambdaProps: lambda.FunctionProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        LISTINGS_TABLE_NAME: listingsTable.tableName,
        VIEWINGS_TABLE_NAME: viewingsTable.tableName,
        S3_BUCKET_NAME: mediaBucket.bucketName,
        SNS_TOPIC_ARN: notificationsTopic.topicArn,
      },
    };

    // Get Listings Lambda
    const getListingsFunction = new lambda.Function(this, 'GetListingsFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: 'getListings.handler',
    });

    // Get Listing by ID Lambda
    const getListingByIdFunction = new lambda.Function(this, 'GetListingByIdFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: 'getListingById.handler',
    });

    // Create Listing Lambda
    const createListingFunction = new lambda.Function(this, 'CreateListingFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: 'createListing.handler',
    });

    // Create Viewing Request Lambda
    const createViewingRequestFunction = new lambda.Function(this, 'CreateViewingRequestFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: 'createViewingRequest.handler',
    });

    // Get Viewing Requests Lambda
    const getViewingRequestsFunction = new lambda.Function(this, 'GetViewingRequestsFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: 'getViewingRequests.handler',
    });

    // Approve Viewing Request Lambda
    const approveViewingRequestFunction = new lambda.Function(this, 'ApproveViewingRequestFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: 'approveViewingRequest.handler',
    });

    // Grant permissions
    listingsTable.grantReadData(getListingsFunction);
    listingsTable.grantReadData(getListingByIdFunction);
    listingsTable.grantWriteData(createListingFunction);
    listingsTable.grantReadData(createViewingRequestFunction);
    listingsTable.grantReadData(approveViewingRequestFunction);

    viewingsTable.grantReadData(getViewingRequestsFunction);
    viewingsTable.grantWriteData(createViewingRequestFunction);
    viewingsTable.grantReadWriteData(approveViewingRequestFunction);

    mediaBucket.grantReadWrite(createListingFunction);
    notificationsTopic.grantPublish(createViewingRequestFunction);
    notificationsTopic.grantPublish(approveViewingRequestFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'RealitorApi', {
      restApiName: 'Realitor API',
      description: 'API for Realitor rental listing application',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
      },
    });

    // API Resources and Methods
    const listings = api.root.addResource('listings');
    const viewingRequests = api.root.addResource('viewing-requests');

    // Listings endpoints
    listings.addMethod('GET', new apigateway.LambdaIntegration(getListingsFunction));
    listings.addMethod('POST', new apigateway.LambdaIntegration(createListingFunction));

    const listing = listings.addResource('{id}');
    listing.addMethod('GET', new apigateway.LambdaIntegration(getListingByIdFunction));

    // Viewing requests endpoints
    viewingRequests.addMethod('GET', new apigateway.LambdaIntegration(getViewingRequestsFunction));
    viewingRequests.addMethod('POST', new apigateway.LambdaIntegration(createViewingRequestFunction));

    const viewingRequest = viewingRequests.addResource('{id}');
    const approveViewingRequest = viewingRequest.addResource('approve');
    approveViewingRequest.addMethod('PUT', new apigateway.LambdaIntegration(approveViewingRequestFunction));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: mediaBucket.bucketName,
      description: 'S3 Bucket for media storage',
    });

    new cdk.CfnOutput(this, 'SnsTopicArn', {
      value: notificationsTopic.topicArn,
      description: 'SNS Topic for notifications',
    });
  }
} 