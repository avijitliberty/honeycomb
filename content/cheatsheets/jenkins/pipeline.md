---
title: Pipeline
linktitle: Pipeline
type: book
date: "2019-05-05T00:00:00+01:00"
tags:
  - Jenkins

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 1
---

Continuous delivery and continuous deployment

<!--more-->

### Overview

Jenkins provides three different project types that can define your continuous project:

* Freestyle Projects: Freestyle ("chained") projects (also called jobs) have been used to define the build flow almost  from the day Jenkins was born. They use job orchestration tools such as the Job DSL plugin or Jenkins Job Builder. Freestyle jobs are still supported and are useful in specific situations but are not recommended for most new development.

Freestyle jobs only provide sequential steps although they can be chained with upstream/downstream. They are also not defined in code, only through the GUI and do not provide centralized configuration.

Modern continuous delivery and deployment is often much more complex than what chained jobs can support. Even when the objectives can be achieved with Freestyle, the result is cumbersome, hard to maintain, and difficult to visualise. It is not possible — or difficult — Many continuous objectives cannot be solved or, at best, are very difficult to implement with Freestyle

* Pipeline Projects: Jenkins Pipeline is a tool for defining your Continuous Delivery/deployment flow as code. It is a separate fundamental "type" in Jenkins that conceptualizes and models a Continuous Delivery process in code. Two syntaxes are supported:
  * Scripted: sequential execution, using Groovy expressions for flow control
  * Declarative: uses a framework to control execution

Both syntaxes use a customized DSL (Domain-Specific Language) that is based on Apache Groovy to programmatically manipulate Jenkins Objects. The Pipeline defines the entire continuous delivery process as code. and is not a job creation tool like the Job DSL plugin or Jenkins Job Builder.

  * Declarative Pipeline
  * Scripted Pipeline

### Pipeline-as-code

A Pipeline is defined in a Jenkinsfile that uses a DSL based on Apache Groovy syntax. The deployment flow is expressed as code; it can express complex flows, conditionals and such.

### Jenkins vocabulary

Jenkins vocabulary
Controller: (previously called "master" is a computer, VM or container where Jenkins is installed and run. It serves requests and handles build tasks.

Agent: (previously called "slave") is a computer, VM or container that connects to a Jenkins Master. It executes tasks when directed by the Master and has a number and scope of operations to perform.

Node is sometimes used to refer to the computer, VM or container used for the controller or agent; be careful because "Node" has another meaning for Pipeline.

Executor: is a computational resource for running builds. It performs operations and can run on any controller or agent, although running builds on masters is strongly discouraged because it can degrade performance and opens up serious security vulnerabilities. An executor can be parallelized on a specific controller or agent.

Jenkins Pipeline sections
The Jenkinsfile that defines a pipeline uses a DSL based on Apache Groovy syntax.

The basic structure of a Declarative Pipeline is simple and straightforward:

It is structured in sections, called Stages, each of which defines a chunk of work to be done.

Each Stage includes Steps that execute the actual programs and scripts to be run.

Some Steps are built into Pipeline and many others are provided in plugins.

An Agent statement defines the node where the programs and scripts execute. You can define one Agent to run the entire pipeline or you can specify different agents for different stages.

The agent section must be coded differently for Agents that run on Kubernetes

An agent defines where the programs and scripts execute.

We will say much more about these components later and, of course, a real-world Pipeline gets much more complelx.

Declarative versus Scripted Pipeline
Declarative and Scripted Pipelines use different syntaxes, but both are defined in a Jenkinsfile under source code management (SCM) and both use the same pipeline subsystem.

Both rely on the Pipeline DSL, which is based on Apache Groovy syntax and both support shared libraries.

Scripted pipeline
Scripted pipeline was the original syntax. It uses the Pipeline DSL, which is based on Apache Groovy, to define build steps and accomplish in a single script flow what would require many freestyle jobs chained together.

The Pipeline DSL provides a simple way to define common tasks like accessing a SCM repository, defining the node on which a task should run, parallel execution and so on. More complicated tasks can be defined using Groovy, so the pipeline can use conditionals, loops, variables and so on. Groovy is an integral part of Jenkins, so we can also use it to access almost any existing Jenkins plugin or even to operate on Jenkins core features.

To summarize scripted pipeline:

Executed serially, from top down

Relies on Groovy expressions for flow control

Requires extensive knowledge of Groovy syntax

Very flexible and extensible

Limitations are mostly Groovy limitations

Scripted pipeline works well for power users with complex requirements but novice users can easily mess up the whole system and most users do not need all the flexibility it accords.

Declarative Pipeline
The declarative pipeline syntax provides a defined set of capabilites that lets you define a pipeline without learning Groovy. It offers an stricter, pre-defined structure with the following advantages:

Execution can always be resumed after an interruption, no matter what caused the interruption

Requires only limited knowledge of Groovy syntax

Using Blue Ocean simplifies the Pipeline creation process even more

Encourages a declarative programming model

Reduces the risk of syntax errors

Use the script step to include bits of scripted code within a Declarative Pipeline only when you have needs that are beyond the capabilities of Declarative syntax

This is illustrated in the following simple declarative Jenkinsfile:

pipeline {
  agent { label 'linux' }
  stages {
    stage('MyBuild') {
      steps {
        sh './jenkins/build.sh'
      }
    }
    stage('MySmalltest') {
      steps {
        sh './jenkins/smalltest.sh'
      }
    }
  }
}
This course is focused on Declarative Pipeline; scripted is an advanced topic that is touched on only briefly.

Tools for working with pipeline
Pipelines can be developed and maintained using different tools:

Graphical Blue Ocean Visual Editor with the embedded Code Editor

Jenkins dashboard with the inline editor that is provided

Jenkins dashboard with a text editor and standard SCM tools

All tools result in the same Jenkinsfile that defines the Pipeline as code so the the tools can be used interchangeably on the same Pipeline.

Classic Web UI
Both scripted and declarative pipelines can be created and modified using the web UI. You code the Jenkinsfile using the text editor of your choice then use the Jenkins dashboard to run and configure the Pipeline . Tools are provided to simplify the process: espeically the Declarative Directive Generator for declarative pipelines and the Snippet Generator for scripted pipelines. Each of these can generate a line of code based on the task that is required and information you input to an appropriate form. All features for declarative and scripted pipelines can be implemented this way.

Blue Ocean Graphical Editor
The Blue Ocean Graphical Editor greatly simplifies the tasks of creating and running declarative pipelines. It is a visual editor you can use to easily create, modify, and run multibranch declarative pipelines. It provides a visual editor that makes it very easy for novices to create a new pipeline, Add/remove configuration, stages and steps. It includes a Code Editor that can be used to implement pipeline features not supported by the GUI or to do edits that are easier to do with an editor.

Round-trip to the Jenkinsfile file that is the Pipeline

Supports Git, GitHub, GitHub Enterprise and Bitbucket Server and Cloud

Supports most features that the Classic Web UI supports

Provides visualization and analysis for the Pipeline run

Generates a Jenkinsfile and stores it in the source code repository

Blue Ocean editor limitations
The Blue Ocean Visual Editor does not support all pipeline capabilities.

Use the Blue Ocean Code Editor or another text editor to incorporate such features into your Pipeline.

The Declarative Directive Generator can help with the syntax when using the Code Editor or a text editor.

Blue Ocean can run a Pipeline that includes these features.

Specify environment variables within a block

post section that defines actions that run at the end of a Pipeline run or an individual stage

Apply options to the Pipeline

Use the when directive

Define and access credentials
