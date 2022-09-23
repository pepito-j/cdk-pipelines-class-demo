#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkPipelineDemoStack } from '../lib/cdk_pipeline';


const app = new cdk.App();
new CdkPipelineDemoStack(app, 'CdkPipelineDemoStack', {
  env: { 
    region: 'us-west-2' 
  }
});