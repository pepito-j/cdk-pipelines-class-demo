#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkPipelineStack } from '../lib/cdk_pipeline_lab-stack';

const app = new cdk.App();
new CdkPipelineStack(app, 'CdkPipelineLabStack', {
  env: {
    account: '848135204948',
    region: 'us-west-2'
  }
});