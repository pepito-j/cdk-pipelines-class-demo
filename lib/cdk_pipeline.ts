import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk_pip from 'aws-cdk-lib/pipelines';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets'
import { Topic } from 'aws-cdk-lib/aws-sns'
import * as path from 'path'


export class CdkPipelineDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Initialize the pipeline
    const cdkPipeline = new cdk_pip.CodePipeline(this, "CDKPipeline", {
      // crossAccountKeys: true, // Allow cross region/account deployment
      synth: new cdk_pip.ShellStep('SynthesizeStep', {
        input: cdk_pip.CodePipelineSource.connection('pepitoj-amzn/cdk-pipelines-class-demo', 'master', {
          connectionArn: 'arn:aws:codestar-connections:us-west-2:848135204948:connection/5ba7c6b8-2a9d-4b53-8c96-adf5ae0eeab5',
        }),
        commands: [
          'npm ci', // npm clean install
          'npx cdk synth', // npx infers runnign npm packages (like cdk)
        ]
      })
    })

    cdkPipeline.addStage(new SNSStage(this, "SNSStage1", {
        env: {
            region: "us-west-2"
        }
      })
    )
    cdkPipeline.addStage(new SNSStage(this, "SNSStage2", {
      env: {
        region: "us-west-2"
    }
    }))
    cdkPipeline.addStage(new SNSStage(this, "SNSStage3", {
      env: {
        region: "us-west-2"
    }
    }))
  }
}

class SNSStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps){
        super(scope, id, props)
        new TopicsStack(this, "MyTopicsStack1")
        new TopicsStack(this, "MyTopicsStack2")
    }
}

class TopicsStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props)

        new Topic(this, "MyTopicResource")
        new s3_assets.Asset(this, "MyAsset", {
          path: path.join(__dirname, "someRandomFile.yml")
        })
    }
}

/**
 * 1. CDK Piplines are just normal Codepipeliens
 * 2. The way we use them is to simply initialize the Codepipeline object from aws_cdk_lib.pipelines
 * 3. They will always come with the following stages already defined:
 *    - Source
 *    - 2 "Build" stages
 *      - Synthesis Step (aka "cdk synth")
 *      - SelfMutation Step (aka "cdk deploy")
 *    - Assets (maybe)
 *      - Appears if we have Assets within our app
 *    - Many "Application" stages
 *      - Abstractions of groups of CFN Stacks deployed together
 */

/**
"SomePipeline" -|
    "Stacks that we want to deploy" (i.e. Stages) -|
      Stack1
      Stack2
      Stack3
      .....
 */