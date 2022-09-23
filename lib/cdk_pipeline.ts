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
      crossAccountKeys: true, // Allow cross region/account deployment
      synth: new cdk_pip.ShellStep('SynthesizeStep', {
        input: cdk_pip.CodePipelineSource.connection('pepitoj-amzn/cdk-pipelines-class-demo', 'master', {
          connectionArn: 'arn:aws:codestar-connections:us-west-2:848135204948:connection/5ba7c6b8-2a9d-4b53-8c96-adf5ae0eeab5',
        }),
        commands: [
          'npx cdk synth',
        ]
      })
    })

    cdkPipeline.addStage(new SNSStage(this, "SNSStage", {
        env: {
            region: "us-east-1"
        }
      })
    )
  }
}

class SNSStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps){
        super(scope, id, props)

        new TopicsStack(this, "MyTopicsStack")

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