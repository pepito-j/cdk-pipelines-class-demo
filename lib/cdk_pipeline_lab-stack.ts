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
          input: CodePipelineSource.connection('<GITHUB_USERNAME>/<GITHUB_REPO_NAME>', '<BRANCH_NAME>', {
            connectionArn: '<CODE_STAR_CONNECTION_ARN>'
          }),
          commands: ['npm ci', 'npm run build', 'npx cdk synth']
        })
      });

      pipeline.addStage(new MyPipelineAppStage(this, "MyPipelineAppStage"));
    
    }
}
