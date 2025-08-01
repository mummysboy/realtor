#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RealitorStack } from '../lib/realitor-stack';

const app = new cdk.App();
new RealitorStack(app, 'RealitorStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region depends on the AWS CLI profile you use for deployment.
   *
   * Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration.
   */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy this stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
}); 