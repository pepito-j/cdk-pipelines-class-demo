import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { MyLambdaStack, MySNSStack } from './my-pipeline-lambda-stack';


export class MyPipelineAppStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        new MyLambdaStack(this, 'LambdaStack1');
        new MyLambdaStack(this, 'LambdaStack2');
        new MyLambdaStack(this, 'LambdaStack3');
    }
}


export class MyPipelineOtherStacksStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        for(let index = 0; index < 3; index++)
            new MySNSStack(this, `SNSStack${index}`);
    }
}