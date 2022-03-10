---
title: CDK
linktitle: CDK
type: book
tags:
  - AWS
date: "2019-05-05T00:00:00+01:00"

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 120
---

AWS Cloud Development Kit (CDK)

<!--more-->

### Overview

CDK builds on top of CloudFormation and allows us to describe the CloudFormation resources that we want to deploy in a programming language like Java or
TypeScript. This way, we have a real “infrastructure as code” solution and don’t have to handle CloudFormation files in YAML or JSON anymore.

CDK currently allows to describe cloud resources in Java, Javascript, Typescript, Python, or C#. It “synthesizes” the code we create in one of these languages into plain old CloudFormation templates. We can then deploy them with the AWS CLI or the more specialized **CDK CLI**, which is a little easier to work with for us humans. A CDK “App” can contain one or more CloudFormation stacks that we can interact with separately via CLI commands.

### Installation

- 👉 [Node.js](https://nodejs.org/en/download/)
- 👉 [CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)

{{% callout note %}}

If you wish to install a specific CDK version specify the same in the npm install:

```npm install -g aws-cdk@X.YY.Z```      

{{% /callout %}}

### Creating the CDK App

```
cdk init app --language=java
```
After CDK has created our app we’re greeted with this message:

```
# Welcome to your CDK Java project!

This is a blank project for Java development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

It is a [Maven](https://maven.apache.org/) based project, so you can open this project with any Maven compatible Java IDE to build and run tests.

## Useful commands

 * `mvn package`     compile and run tests
 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation

Enjoy!
```
If we look in the generated code we find these 2 classes:

```java
public class CdkApp {
    public static void main(final String[] args) {
        App app = new App();

        new CdkStack(app, "CdkStack", StackProps.builder()
                // If you don't specify 'env', this stack will be environment-agnostic.
                // Account/Region-dependent features and context lookups will not work,
                // but a single synthesized template can be deployed anywhere.

                // Uncomment the next block to specialize this stack for the AWS Account
                // and Region that are implied by the current CLI configuration.
                /*
                .env(Environment.builder()
                        .account(System.getenv("CDK_DEFAULT_ACCOUNT"))
                        .region(System.getenv("CDK_DEFAULT_REGION"))
                        .build())
                */

                // Uncomment the next block if you know exactly what Account and Region you
                // want to deploy the stack to.
                /*
                .env(Environment.builder()
                        .account("123456789012")
                        .region("us-east-1")
                        .build())
                */

                // For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
                .build());

        app.synth();
    }
}

```

```java
public class CdkStack extends Stack {
    public CdkStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public CdkStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // The code that defines your stack goes here

        // example resource
        // final Queue queue = Queue.Builder.create(this, "CdkQueue")
        //         .visibilityTimeout(Duration.seconds(300))
        //         .build();
    }
}

```

That’s all the code we need for a working CDK app!

CdkApp is the main class of the app. It’s a standard Java class with a standard
main() method to make it executable. The main() method creates an App
instance and a CdkStack instance and finally calls app.synth() to tell the
CDK app to create CloudFormation files with all the CloudFormation resources
it contains. These CloudFormation files will be written to the folder named
cdk.out.

### Deploying the CDK App

Let’s try to deploy the generated CDK app. This is as easy as executing the ```cdk deploy``` command in the folder of the app.
It will take a couple of seconds and we’ll be rewarded with a success message like this one:

```
C:\Repos\todo-in-cloud\cdk>cdk deploy
CdkStack: deploying...
CdkStack: creating CloudFormation changeset...
CdkStack | 0/2 | 1:40:35 PM | REVIEW_IN_PROGRESS   | AWS::CloudFormation::Stack | CdkStack User Initiated
CdkStack | 0/2 | 1:40:41 PM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack | CdkStack User Initiated
CdkStack | 0/2 | 1:40:45 PM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata/Default (CDKMetadata)
CdkStack | 0/2 | 1:40:46 PM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata/Default (CDKMetadata) Resource creation Initiated
CdkStack | 1/2 | 1:40:46 PM | CREATE_COMPLETE      | AWS::CDK::Metadata | CDKMetadata/Default (CDKMetadata)
CdkStack | 2/2 | 1:40:48 PM | CREATE_COMPLETE      | AWS::CloudFormation::Stack | CdkStack

 ✅  CdkStack

Stack ARN:
arn:aws:cloudformation:us-west-1:651605539608:stack/CdkStack/cedefc70-5a01-11ec-9105-066d11ed7e71
```

This means that CDK has successfully deployed the (empty) stack. If we log in
to the AWS web console and navigate to the CloudFormation service, we should
see a stack called “TestStack” deployed there:

![AWS CDK Empty Stack](/images/uploads/aws-cdk-empty-stack.png)

The stack contains a single resource called CDKMetadata, which the CDK needs
to work with that stack. Before moving on, let’s destroy the stack again with ```cdk destroy```
