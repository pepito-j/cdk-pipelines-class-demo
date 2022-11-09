import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Topic} from 'aws-cdk-lib/aws-sns';

export class MyLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new Function(this, 'LambdaFunction', {
            runtime: Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: new InlineCode('exports.handler = _ => "Hello, CDK";')
        });
    }
}


export class MySNSStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        
        for(let index = 0; index < 3; index++) {
            new Topic(this, `Topic${index}`, {});
        }

    }
}