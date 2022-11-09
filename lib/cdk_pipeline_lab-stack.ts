import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage'

export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
        pipelineName: 'MyPipeline',
        synth: new ShellStep('Synth', {
          input: CodePipelineSource.connection('pepito-j/cdk-pipelines-class-demo', 'master', {
            connectionArn: 'arn:aws:codestar-connections:us-west-2:848135204948:connection/5ba7c6b8-2a9d-4b53-8c96-adf5ae0eeab5'
          }),
          commands: ['npm ci','npx cdk synth']
        }),
        selfMutation: false
      });

      pipeline.addStage(new MyPipelineAppStage(this, "MyPipelineAppStage"));
      const wave = pipeline.addWave("MyParallelStages")
      wave.addStage(new MyPipelineAppStage(this, "MyPipelineAppStage1"))
      wave.addStage(new MyPipelineAppStage(this, "MyPipelineAppStage2"))
    }
}
