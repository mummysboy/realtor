import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
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
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
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

    // Reference OpenAI API Key parameter from Parameter Store
    // The parameter should already be created manually:
    // aws ssm put-parameter --name "/realitor/openai/api-key" --value "your-openai-api-key" --type "SecureString"
    const openaiApiKeyParameterName = '/realitor/openai/api-key';

    // Lambda Functions
    const commonLambdaProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        LISTINGS_TABLE_NAME: listingsTable.tableName,
        VIEWINGS_TABLE_NAME: viewingsTable.tableName,
        S3_BUCKET_NAME: mediaBucket.bucketName,
        SNS_TOPIC_ARN: notificationsTopic.topicArn,
        OPENAI_API_KEY_PARAMETER_NAME: openaiApiKeyParameterName,
      },
    };

    // Get Listings Lambda
    const getListingsFunction = new lambda.Function(this, 'GetListingsFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'getListings.handler',
    });

    // Get Listing by ID Lambda
    const getListingByIdFunction = new lambda.Function(this, 'GetListingByIdFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'getListingById.handler',
    });

    // Create Listing Lambda
    const createListingFunction = new lambda.Function(this, 'CreateListingFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'createListing.handler',
    });

    // Create Viewing Request Lambda
    const createViewingRequestFunction = new lambda.Function(this, 'CreateViewingRequestFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'createViewingRequest.handler',
    });

    // Get Viewing Requests Lambda
    const getViewingRequestsFunction = new lambda.Function(this, 'GetViewingRequestsFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'getViewingRequests.handler',
    });

    // Approve Viewing Request Lambda
    const approveViewingRequestFunction = new lambda.Function(this, 'ApproveViewingRequestFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'approveViewingRequest.handler',
    });

    // Deny Viewing Request Lambda
    const denyViewingRequestFunction = new lambda.Function(this, 'DenyViewingRequestFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'denyViewingRequest.handler',
    });

    // Cancel Appointment Lambda
    const cancelAppointmentFunction = new lambda.Function(this, 'CancelAppointmentFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'cancelAppointment.handler',
    });



    // Update Listing Lambda
    const updateListingFunction = new lambda.Function(this, 'UpdateListingFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'updateListing.handler',
    });

    // Delete Listing Lambda
    const deleteListingFunction = new lambda.Function(this, 'DeleteListingFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'deleteListing.handler',
    });

    // Upload Image Lambda
    const uploadImageFunction = new lambda.Function(this, 'UploadImageFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'uploadImage.handler',
    });

    // Translate Text Lambda
    const translateTextFunction = new lambda.Function(this, 'TranslateTextFunction', {
      ...commonLambdaProps,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),
      handler: 'translateText.handler',
    });

    // Grant permissions
    listingsTable.grantReadData(getListingsFunction);
    listingsTable.grantReadData(getListingByIdFunction);
    listingsTable.grantWriteData(createListingFunction);
    listingsTable.grantReadWriteData(updateListingFunction);
    listingsTable.grantReadWriteData(deleteListingFunction);
    listingsTable.grantReadData(createViewingRequestFunction);
    listingsTable.grantReadData(approveViewingRequestFunction);
    listingsTable.grantReadData(denyViewingRequestFunction);
    listingsTable.grantReadData(cancelAppointmentFunction);

    mediaBucket.grantReadWrite(uploadImageFunction);

    viewingsTable.grantReadData(getViewingRequestsFunction);
    viewingsTable.grantWriteData(createViewingRequestFunction);
    viewingsTable.grantReadWriteData(approveViewingRequestFunction);
    viewingsTable.grantReadWriteData(denyViewingRequestFunction);
    viewingsTable.grantReadWriteData(cancelAppointmentFunction);

    mediaBucket.grantReadWrite(createListingFunction);
    notificationsTopic.grantPublish(createViewingRequestFunction);
    notificationsTopic.grantPublish(approveViewingRequestFunction);
    notificationsTopic.grantPublish(denyViewingRequestFunction);

    // Grant Lambda functions permission to read OpenAI API key from Parameter Store
    const lambdaFunctions = [
      getListingsFunction,
      getListingByIdFunction,
      createListingFunction,
      createViewingRequestFunction,
      getViewingRequestsFunction,
      approveViewingRequestFunction,
      denyViewingRequestFunction,
      cancelAppointmentFunction,
      updateListingFunction,
      deleteListingFunction,
      uploadImageFunction,
      translateTextFunction
    ];

    // Grant Lambda functions permission to read OpenAI API key parameter
    lambdaFunctions.forEach(func => {
      func.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ssm:GetParameter'],
        resources: [`arn:aws:ssm:${this.region}:${this.account}:parameter${openaiApiKeyParameterName}`]
      }));
    });

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
    listing.addMethod('PUT', new apigateway.LambdaIntegration(updateListingFunction));
    listing.addMethod('DELETE', new apigateway.LambdaIntegration(deleteListingFunction));

    // Upload image endpoint
    const uploadImage = api.root.addResource('upload-image');
    uploadImage.addMethod('POST', new apigateway.LambdaIntegration(uploadImageFunction));

    // Translate text endpoint
    const translate = api.root.addResource('translate');
    translate.addMethod('POST', new apigateway.LambdaIntegration(translateTextFunction));

    // Viewing requests endpoints
    viewingRequests.addMethod('GET', new apigateway.LambdaIntegration(getViewingRequestsFunction));
    viewingRequests.addMethod('POST', new apigateway.LambdaIntegration(createViewingRequestFunction));

    const viewingRequest = viewingRequests.addResource('{id}');
    const approveViewingRequest = viewingRequest.addResource('approve');
    approveViewingRequest.addMethod('PUT', new apigateway.LambdaIntegration(approveViewingRequestFunction));
    
    const denyViewingRequest = viewingRequest.addResource('deny');
    denyViewingRequest.addMethod('PUT', new apigateway.LambdaIntegration(denyViewingRequestFunction));
    
    const cancelAppointment = viewingRequest.addResource('cancel');
    cancelAppointment.addMethod('PUT', new apigateway.LambdaIntegration(cancelAppointmentFunction));



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