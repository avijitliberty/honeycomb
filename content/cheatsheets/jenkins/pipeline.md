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

* **Freestyle Projects**: Freestyle ("chained") projects (also called jobs) have been used to define the build flow almost  from the day Jenkins was born. They use job orchestration tools such as the Job DSL plugin or Jenkins Job Builder. Freestyle jobs are still supported and are useful in specific situations but are not recommended for most new development. <br><br> Freestyle jobs only provide sequential steps although they can be chained with upstream/downstream. They are also not defined in code, only through the GUI and do not provide centralized configuration.

* **Pipeline Projects**: Jenkins Pipeline is a tool for defining your Continuous Delivery/deployment flow as code. It is a separate fundamental "type" in Jenkins that conceptualizes and models a Continuous Delivery process in code. Two syntaxes are supported:
  * Scripted: sequential execution, using Groovy expressions for flow control
  * Declarative: uses a framework to control execution

  <br>
  Both syntaxes use a customized DSL (Domain-Specific Language) that is based on Apache Groovy to programmatically manipulate Jenkins Objects. The Pipeline defines the entire continuous delivery process as code and is not a job creation tool like the Job DSL plugin or Jenkins Job Builder.

### Jenkins vocabulary

* **Controller**: (previously called "master" is a computer, VM or container where Jenkins is installed and run. It serves requests and handles build tasks.
* **Agent**: (previously called "slave") is a computer, VM or container that connects to a Jenkins Master. It executes tasks when directed by the Master and has a number and scope of operations to perform.
* **Node** is sometimes used to refer to the computer, VM or container used for the controller or agent; be careful because "Node" has another meaning for Pipeline.
* **Executor**: is a computational resource for running builds. It performs operations and can run on any controller or agent, although running builds on masters is strongly discouraged because it can degrade performance and opens up serious security vulnerabilities. An executor can be parallelized on a specific controller or agent.

### Jenkins Pipeline sections

The Jenkinsfile that defines a pipeline uses a DSL based on Apache Groovy syntax.
The basic structure of a Declarative Pipeline is simple and straightforward:

* It is structured in sections, called **Stages**, each of which defines a chunk of work to be done.
* Each Stage includes **Steps** that execute the actual programs and scripts to be run.
  * Some Steps are built into Pipeline and many others are provided in plugins.
* An **Agent** statement defines the node where the programs and scripts execute. You can define one Agent to run the entire pipeline or you can specify different agents for different stages.
  * The agent section must be coded differently for Agents that run on Kubernetes

### Declarative Vs Scripted Pipeline

Declarative and Scripted Pipelines use different syntaxes, but both are defined in a Jenkinsfile under source code management (SCM) and both use the same pipeline subsystem.

* **Scripted** pipeline:
  Scripted pipeline was the original syntax. It uses the Pipeline DSL, which is based on Apache Groovy, to define build steps and accomplish in a single script flow what would require many freestyle jobs chained together.
  <br>
  The Pipeline DSL provides a simple way to define common tasks like accessing a SCM repository, defining the node on which a task should run, parallel execution and so on. More complicated tasks can be defined using Groovy, so the pipeline can use conditionals, loops, variables and so on. Groovy is an integral part of Jenkins, so we can also use it to access almost any existing Jenkins plugin or even to operate on Jenkins core features.
  <br>
  To summarize scripted pipeline:

    * Executed serially, from top down
    * Relies on Groovy expressions for flow control
    * Requires extensive knowledge of Groovy syntax
    * Very flexible and extensible
    * Limitations are mostly Groovy limitations
    <br>

  Scripted pipeline works well for power users with complex requirements but novice users can easily mess up the whole system and most users do not need all the flexibility it accords.

* **Declarative** pipeline:
  The declarative pipeline syntax provides a defined set of capabilities that lets you define a pipeline without learning Groovy. It offers an stricter, pre-defined structure with the following advantages:

  * Execution can always be resumed after an interruption, no matter what caused the interruption
  * Requires only limited knowledge of Groovy syntax
  * Using Blue Ocean simplifies the Pipeline creation process even more
  * Encourages a declarative programming model
  * Reduces the risk of syntax errors
  * Use the script step to include bits of scripted code within a Declarative Pipeline only when you have needs that are beyond the capabilities of Declarative syntax

  This is illustrated in the following simple declarative Jenkinsfile:

  ```json
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
  ```

### Parallel stages

Stages can be run in parallel, which can reduce the execution time for the Pipeline.. This is especially useful for long-running stages and builds for different target architectures or operating systems (Debian/Fedora, Android/iOS) or different software versions (JVM8/11), et cetera. Builds and tests of independent modules can be run in parallel.

Each "parallelized branch" is a stage. A stage can use either **steps** or **parallel** at the top level; it cannot use both.
Other implementation details for parallel stages are:

* A stage within a parallel stage can contain **agent** and **steps** sections.
* A parallel stage cannot contain **agent** or **tools** because they are not relevant without steps.
* By default, if one parallel stage fails, the other stages continue to execute. Add **failfast** true to force all parallel processes to abort if one stage fails.

#### Scheduling

By default, Jenkins tries to allocate a **stage** to the last node on which it (or a similar stage) executed. This may mean that multiple parallel steps execute on the same node while other nodes in the cluster are idle.
Pipeline **parallel** is NOT, by default, a load balancer. The default scheduling is based on:
* SCM updates are more efficient than SCM checkouts
* Some build tools (such as Maven and RVM) use local caches, and they work faster if Jenkins keeps building a job on the same node.

The disadvantage is that some nodes may be left idle while other nodes are overloaded.
Use the [Least Load Plugin](https://plugins.jenkins.io/leastload/) to replace the default load balancer with one that schedules a new stage to nodes with the least load.

#### Limits to parallelization

Jenkins does not impose a limit on the number of parallel stages used in a single stage. Using a small number of parallel stages improves the speed of a pipeline but, because each parallel branch uses resources to set up and wait, a very large number of parallel stages may actually degrade the pipeline performance, even if the only statement in each stage is an echo statement.

A large number of parallel stages that attempt to pull from a common resource, such as an artifact repository, may also cause performance issues.

Some internal architectural issues between Groovy, the Groovy CPS library, and the JVM classfile format occasionally cause even medium-sized pipelines to fail during compilation with errors such as "Method code too large" or "Class too large".

In summary, using a few parallel stages can improve the performance of your Pipeline but you should avoid using too many parallel stages.
