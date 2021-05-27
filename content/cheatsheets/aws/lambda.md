---
title: Lambda
linktitle: Lambda
type: book
tags:
  - AWS
date: "2019-05-05T00:00:00+01:00"
# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 40
---

Run Code Serverless

<!--more-->

### Overview

* Lambda is a compute service where you can upload your code and create a lambda function. AWS Lambda takes care of the provisioning and managing the servers that you use to run your code
  so you don't have to worry about operating systems patching scaling etc. You can use lambda in the following ways:

  * Lambda can act as an **event driven** compute service where AWS lambda runs your code in response to events. These events could be anything, could be changes to your data in S3 or it could be a change to your data in a DynamoDB table etc..
  * As a compute service to run your code in response to HTTP requests using Amazon APIGateway, Application Load Balancer (ALB) or API calls made using the AWS SDK.

### Features

* Lambda scales out (**NOT UP**) automatically.
* Lambda functions are independent, i.e. 1 event = 1 function
* Lambda is serverless.
* Lambda functions can trigger other Lambda functions, 1 event = x functions if functions trigger other functions.
* Architectures can get extremely complicated, AWS X-ray allows you to debug what is happening.
* Lambda can do things globally so you can use it to back up a S3 bucket to other S3 buckets etc. It's not stuck in one region. You can use it all across the AWS ecosystem.

### Permissions

* Two sides to access permission

  * Permissions to invoke the functions
  * What the function is permitted to do
  ![Lambda-Permissions](/images/uploads/Lambda-Permissions.JPG)

  * Execution role gives Lambda permission to interact with other services
    * Selected or created when you create a Lambda function
    * IAM policy includes actions that Lambda can do with the resource
    * Trust policy that allows Lambda to AssumeRole
    * Creator must have permission for iam:PassRole

  * Resource policy gives other services permission to invoke Lambda functions
    * Policy associated with a "push" event source
    * Created when you add a trigger to a Lambda function
    * Allows the event source to take the lambda:InvokeFunction action

### Event sources

  * An event source is the entity that publishes events, and a Lambda function is the custom code that processes the events. Configuration of services as event triggers is referred to as Event Source Mapping

  ![Lambda-EventSources-DataStores](/images/uploads/Lambda-EventSources-DataStores.JPG)
  ![Lambda-EventSources-EndPoints](/images/uploads/Lambda-EventSources-EndPoints.JPG)
  ![Lambda-EventSources-Repositories](/images/uploads/Lambda-EventSources-Repositories.JPG)
  ![Lambda-EventSources-Messaging](/images/uploads/Lambda-EventSources-Messaging.JPG)

  * Each of the event sources will invoke Lambda in one of these execution models:
  ![Lambda-Event-Model](/images/uploads/Lambda-Event-Model.JPG)

  > Notes:
  > * When invoking a Lambda function programmatically, you must specify the invocation type.
  > * When AWS services are sources, the invocation type is predetermined.
  > * The Lambda console shows all event sources for a given function.
  > * When you select Test from the Lambda console, it always invokes your Lambda function synchronously.

#### Push Events

  * Synchronous vs. asynchronous event sources

  {{< tabs tabTotal="2" tabID="1" tabName1="Synchronous Event Sources" tabName2="Asynchronous Event Sources" >}}
  {{% tab tabNum="1" %}}

  * Synchronous events expect an immediate response from the function invocation.
  * With this execution model, there is no built-in retry in Lambda. You must manage your retry strategy within your  application code.
  * To invoke Lambda synchronously via API, use **RequestResponse** invocation type.

  Examples of AWS services that invoke Lambda synchronously -

   * User Invoked:
     * Elastic Load Balancing (Application Load Balancer)
     * Amazon API Gateway
     * Amazon CloudFront (Lambda@Edge)
     * Amazon S3 Batch

   * Service Invoked:
     * Amazon Cognito
     * AWS Step Functions

   * Other Services:
     * Amazon Lex
     * Amazon Alexa
     * Amazon Kinesis Data Firehose

   {{% /tab %}}
   {{% tab tabNum="2" %}}

  * Asynchronous events are placed in an Event Queue, and the requestor doesn't wait for the function to complete.
  * This model makes sense for batch processes. With an async event, Lambda automatically retries the invoke twice more on your behalf. You also have the option to enable a dead-letter queue on your Lambda function.
  * Make sure the processing is idempotent (in case of retries)
  * In November 2019, two new error handling options were added to give you more control over failed records from asynchronous event sources: Maximum Event Age and Maximum Retry Attempts.
  * To invoke functions asynchronously via API, use **Event** invocation type.

  Examples of AWS services that invoke Lambda asynchronously -

   * Amazon Simple Storage Service (Amazon S3)
   * Amazon Simple Notification Service (Amazon SNS)
   * Amazon Simple Email Service (Amazon SES)
   * Amazon CloudWatch Logs
   * AWS CloudFormation
   * Amazon CloudWatch Events
   * AWS CodeCommit
   * AWS Config
   * AWS Internet of Things (IoT) button

   {{% /tab %}}
   {{% /tabs %}}

Checkout CLI references here: [Lambda-CLI]({{< ref "/cheatsheets/aws/aws-cli.md#lambda" >}} "Lambda-CLI")

#### Polling Events

  * Three services use the polling model: DynamoDB, Kinesis and SQS.
  * In this model the events put information onto the stream or queue respectively.
  * Event Source Mapping will poll SQS queues or streams at regular intervals.
  * Your Lambda function is invoked synchronously

  ![Lambda-Polling-Events](/images/uploads/Lambda-Polling-Events.JPG)

  {{% tabs tabTotal="2" tabID="2" tabName1="Streams" tabName2="Queues" %}}
   {{% tab tabNum="1" %}}

   <img align="right" width="250" height="250" src="/images/uploads/lambda-kinesis-1.PNG">

   * Stream-based polling there is no cost to make the polling calls.
   * An event source mapping creates an iterator for each shard, processes items in order
   * Start with new items, from the beginning or from timestamp
   * Processed items aren't removed from the stream (other consumers can read them)
   * Low traffic: use batch window to accumulate records before processing
   * You can process multiple batches in parallel
     * up to 10 batches per shard
     * in-order processing is still guaranteed for each partition key,
   * With streams, errors in a shard block further processing:
   – A failure in this model blocks Lambda from reading any new records from the stream until the failed batch of records either expires or is processed successfully. This is important because the events in each shard from the stream need to be processed in order.
   * Scaling:

     * One Lambda invocation per stream shard
     * If you use parallelization, up to 10 batches processed per shard simultaneously

   ![Lambda-Kinesis](/images/uploads/lambda-kinesis-2.PNG)

   {{% /tab %}}
   {{% tab tabNum="2" %}}

   <img align="right" width="250" height="250" src="/images/uploads/lambda-sqs.PNG">

   * With SQS polling, standard SQS rates apply for each request.
   * Event Source Mapping will poll SQS (Long Polling)
   * Specify batch size (1-10 messages)
   * Recommended: Set the queue visibility timeout to 6x the timeout of your Lambda function
   * To use a DLQ set-up on the SQS queue, not Lambda (DLQ for Lambda is only for async invocations)
   * Or use a Lambda destination for failures
   * With queues, errors in a batch are returned to queue
     – Lambda will keep retrying a failed message until it is processed successfully, or the retries or retention period are exceeded. If the message fails all retries, it will either go to the DLQ if  configured, or it will be discarded. An error doesn't stop processing of the batch, but there may be a change to the order in which messages are processed.
   * Scaling:

     * SQS Standard:
       * Lambda adds 60 more instances per minute to scale up
       * Up to 1000 batches of messages processed simultaneously
     * SQS FIFO:
       * Messages with the same GroupID will be processed in order
       * The Lambda function scales to the number of active message groups

   {{% /tab %}}
  {{% /tabs %}}

### Lifecycle of a Lambda function

  1. When a function is first invoked, an execution context is launched and bootstrapped. This execution context initializes any external dependencies of your lambda code, database connections, HTTP clients, SDK client etc. Once the context is bootstrapped, your function code executes. Then, Lambda freezes the execution context, expecting additional invocations. The execution context includes the /tmp directory

  2. If another invocation request for the function is made while the environment is in this state, that request goes through a warm start. With a warm start, the available frozen container is thawed and immediately begins code execution without going through the bootstrap process.

  3. This thaw and freeze cycle continues as long as requests continue to come in consistently. But if the environment becomes idle for too long, the execution environment is recycled.

  4. A subsequent request starts the lifecycle over, requiring the environment to be launched and bootstrapped. This is a cold start.

  {{< video library="true" src="Lambda-LifeCycle.mp4" controls="yes" >}}

  > In 2019, AWS introduced **provisioned concurrency** to give the ability to keep a number of environments "warm" to prevent cold starts from impacting your function's performance.

### Lambda Concurrency and Throttling

  * Concurrency limit: up to 1000 concurrent executions
  * Can set a **Reserved Concurrency** at the function level (=limit)
  * Each invocation over the concurrency limit will trigger a “Throttle”
  * Throttle behavior:
    * If synchronous invocation => return ThrottleError - 429
    * If asynchronous invocation => retry automatically and then go to DLQ
  * If you need a higher limit, open a support ticket

  * Cold Start:

    * New instance => code is loaded and code outside the handler run (init)
    * If the init is large (code, dependencies, SDK…) this process can take some time.
    * First request served by new instances has higher latency than the rest
  * **Provisioned Concurrency**:
    * Concurrency is allocated before the function is invoked (in advance)
    * So the cold start never happens and all invocations have low latency
    * Application Auto Scaling can manage concurrency (schedule or target utilization

    ![Lambda-Concurrency](/images/uploads/lambda-reserve-provisioned-concurrency.PNG)

  > Note:
  > Note: cold starts in VPC have been dramatically reduced in Oct & Nov 2019

### Lambda Layers

You can configure your Lambda function to pull in additional code and content in the form of layers. A layer is a .zip file archive that contains libraries, a custom runtime, or other dependencies. With layers, you can use libraries in your function without needing to include them in your deployment package.

* Custom Runtimes

  * Ex: C++ https://github.com/awslabs/aws-lambda-cpp
  * Ex: Rust https://github.com/awslabs/aws-lambda-rust-runtime

* Externalize Dependencies to re-use them:
  ![Lambda-Concurrency](/images/uploads/lambda-layers.png)

### Authoring Lambda functions

With Lambda, you can use the language and IDE that you are most familiar with and bring code you've already written. The code may need some adjustments to make it serverless.

* Start with the handler method: The handler method is the entry point that AWS Lambda calls to start executing your Lambda function. The handler method always takes two objects: the event object and the context object.

  {{% tabs tabTotal="2" tabID="3" tabName1="Event Object" tabName2="Context Object" %}}
   {{% tab tabNum="1" %}}

   * The event object provides information about the event that triggered the Lambda function. This could be a pre-defined object that an AWS service generates, or it could be a custom user-defined object in the form of a serializable string. For example, it could be a pojo or a json stream.
   ![Lambda-Handler-Event](/images/uploads/Lambda-Handler-Event.JPG)

   {{% /tab %}}
   {{% tab tabNum="2" %}}

   * The context object is generated by AWS, and provides metadata about the execution. You can use it to interact with Lambda. For example, it includes awsRequestld, logStreamName, and the getRemainingTimeInMillis() function.
   ![Lambda-Handler-Context](/images/uploads/Lambda-Handler-Context.JPG)

   {{% /tab %}}
  {{% /tabs %}}

*  Perform heavy-duty work outside of your function handler

   * Connect to databases outside of your function handler
   * Initialize the AWS SDK outside of your function handler
   * Pull in dependencies or datasets outside of your function handler
   ![Lambda-Authoring](/images/uploads/lambda-authoring.PNG)

* Use environment variables for:

   * Database Connection Strings, S3 bucket, etc… don’t put these values in your code
   * Passwords, sensitive values… they can be encrypted using KMS

* If your Lambda function needs disk space to perform operations, you can make use the /tmp directory (Max size is 512MB). The directory content remains when the execution context is frozen, providing transient cache that can be used for multiple invocations.(helpful to checkpoint your work). For permanent persistence of object (non temporary), use S3.

* Minimize your deployment package size to its runtime necessities.

   * Break down the function if need be
   * Remember the AWS Lambda limits
   * Use Layers where necessary

* Avoid using recursive code, never have a Lambda function call itself

### Lambda – Destinations

* Nov 2019: Can configure to send result to a destination
* Asynchronous invocations - can define destinations for successful and failed event:

  <img align="right" width="350" height="350" src="/images/uploads/lambda-destinations-1.PNG">

  * Amazon SQS
  * Amazon SNS
  * AWS Lambda
  * Amazon EventBridge bus
  > Note: AWS recommends you use destinations instead of DLQ now (but both can be used at the same time)

* Event Source mapping: for discarded event batches

  <img align="right" width="350" height="350" src="/images/uploads/lambda-destinations-2.PNG">

  * Amazon SQS
  * Amazon SNS

  > Note: you can send events to a DLQ directly from SQS

### Version Control With Lambda

  * When you use versioning with AWS Lambda you can publish one or more versions of your lambda functions. As a result
    you can work with different variations of your Lambda function in your development workflow, such as Dev, Prod, Beta
    and so on.
  * Each Lambda function version has an unique ARN. After you publish a version it becomes immutable.
  * AWS Lambda maintains your latest code in the $LATEST version.
  * You can refer to your Lambda function using it's ARN. There are 2 ARNs associated with the initial version:
    * Qualified ARN - The function ARN with the version suffix:
      e.g arn:aws:lambda:us-west-1:396087960458:function:SendMessageFunction:**$LATEST**
    * UnQualified ARN - The function ARN without the version suffix:
      e.g arn:aws:lambda:us-west-1:396087960458:function:SendMessageFunction
  * After creating your Lambda function (the $LATEST version), you can publish a Version 1 of it.
    By creating an Alias named "PROD" that points to Version 1, you can now use the "PROD" alias to invoke Version 1 of the Lambda function.
  * You can update the code (the $LATEST version) with improvements and then publish a Version 2.
    You can promote Version 2 to production by remapping the PROD alias so that it points to Version 2.
    If there was any issue, you can easily rollback to Version 1 by remapping back.
  * Cannot split traffic with $LATEST version, instead create an Alias to latest and split that way.

### Monitoring

  In the below sections we will describe few of the tools available to help you monitor and troubleshoot your Lambda functions.

  #### CloudWatch Metrics

  CloudWatch provides 7 metrics out of the box for lambda functions to help you identify at a high level how your functions are performing, errors being generated, and the overall health of your application:

  * Invocations - Number of times a function is invoked in response to an event or invocation API call.
  * Errors - Number of invocations that failed due to errors in the function (response code 4XX).
  * Duration - Elapsed time from when the function code starts executing to when it stops executing.
  * Throttle - Number of Lambda function invocation attempts that were throttled due to invocation rates exceeding the    customer’s concurrent limits (error code 429).
  * Iterator Age - Emitted for stream-based invocations only. Measures the age of the last record for each batch of records processed. Age is the difference between the time Lambda received the batch and the time the last record in the batch was written to the stream.
  * ConcurrentExecutions - Measures the sum of concurrent executions for a given function at a given point in time. Must be viewed as an average metric if aggregated across a time period.
  * UnreservedConcurrentExecutions - Represents the sum of the concurrency of the functions that do not have a custom concurrency limit specified. Must be viewed as an average metric if aggregated across a time period.

  #### CloudTrail Logs

  Logs API calls made by or on behalf of a function

  * Audit actions made against your application
  * Integrate with a CloudWatch rules to respond to audit findings
  * Export for additional analysis
  * CloudTrail can be an important tool for auditing serverless deployments and rolling back unplanned deployments.

  #### Dead Letter Queues

  Dead Letter Queues (DLQs) help you capture application errors that you cannot just discard but must respond to.

  * Use DLQs to analyze failures for follow-up or code corrections.
  * Available for asynchronous and non-stream polling events
  * Can be an Amazon SNS topic or Amazon SQS queue

  #### X-Ray

  * AWS X-Ray is a service that collects data about your requests that your application serves and it
    provides you with tools you can use to view filter and gain insights into that data to identify issues
    and opportunities for optimization. For any traced request to your application, you can see detailed information not only about the request and response, but also about calls that your application makes to downstream AWS resources, microservices, databases and HTTP Web APIs.

  * Enable in Lambda configuration (Active Tracing)
  * Runs the X-Ray daemon for you
  * Use AWS X-Ray SDK in Code
  * Ensure Lambda Function has a correct IAM Execution Role - The managed policy is called AWSXRayDaemonWriteAccess
  * Environment variables to communicate with X-Ray
    * _X_AMZN_TRACE_ID: contains the tracing header
    * AWS_XRAY_CONTEXT_MISSING: by default, LOG_ERROR
    * AWS_XRAY_DAEMON_ADDRESS: the X-Ray Daemon IP_ADDRESS:PORT

### Lambda Limits - per region

  * Execution:

    * Memory allocation: 128 MB – 3008 MB (64 MB increments)
    * Maximum execution time: 900 seconds (15 minutes)
    * Environment variables (4 KB)
    * Disk capacity in the “function container” (in /tmp): 512 MB
    * Concurrency executions: 1000 (can be increased)
  * Deployment:

    * Lambda function deployment size (compressed .zip): 50 MB
    * Size of uncompressed deployment (code + dependencies): 250 MB
    * Can use the /tmp directory to load other files at startup
    * Size of environment variables: 4 KB

<img align="right" width="200" height="200" src="/images/uploads/lambda-vpc.png">

### Lambda VPC Access

* You must define the VPC ID, the Subnets and the Security Groups
* Lambda will create an ENI (Elastic Network Interface) in your subnets
* AWSLambdaVPCAccessExecutionRole is needed by Lambda

#### Lambda in VPC – Internet Access

* A Lambda function in your VPC does not have internet access
* Deploying a Lambda function in a public subnet does not give it internet access or a public IP
* Deploying a Lambda function in a private subnet gives it internet access if you have a NAT Gateway / Instance
* You can use VPC endpoints to privately access AWS services without a NAT
> Note: Lambda - CloudWatch Logs works even without endpoint or NAT Gateway

<img align="center" width="350" height="350" src="/images/uploads/lambda-vpc-internet.png">
