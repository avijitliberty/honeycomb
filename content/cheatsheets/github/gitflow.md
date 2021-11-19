---
title: Gitflow
linktitle: Gitflow
toc: true
type: book
date: "2019-05-05T00:00:00+01:00"
tags:
  - GitHub

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 4
---

Release strategy with Gitflow

<!--more-->

![Gitflow](/images/uploads/Gitflow.JPG)

### Overview

For managing the release strategy in Git for the enterprise we plan on using a slightly modified version of a Gitflow workflow. If you're not familiar there's a lot of info online documenting this pattern, and [Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) has a nice write-up on their site. By applying this workflow we hope to be able to maintain stable branches to run builds and deploys from, provide useful checkpoints to serve as a natural code review, and allow easier merges that are tied more directly to the individual delivering conflicting code.

The pattern breaks down into two main groups of branches:

1. Long-lived community owned branches that require pull requests to merge code into - these branches should always be expected to be buildable/deployable and the pull request provides a natural point for conducting a code review:
   1. master -
      1. this branch will be kept in sync with production code
      2. main purpose is really record keeping so that we always have a location we could build from to replicate production code
      3. should only ever get code through pull request from a release branch
   2. release -
      1. we will create a release branch for each monthly release by branching from develop on construct.
      2. will serve as the source for all release candidate builds that are promoted through ETE to prod.
      3. should be feature stable and only bugfix development should be happening against it
      4. will be tagged on each successful CI build.
      5. should only receive code through pull requests from bugfix branches.
      6. EC/EBF for prod is required a release branch would be created from master to support it. These use the naming convention release/YYYY.MM.v where v is the version number which is incremented for each off-cycle release. The first off-schedule release of any month starts at 1.
   3. develop -
      1. default development target
      2. all release branches will be cut from develop, that means any code going into this branch should be expected to be delivered to production with the next monthly release
      3. will receive code from feature branch pulls, and from automated merges from release and master branches as they receive changes.
2. Short-term individually owned branches which are used to house active development of a feature or bugfix. These branches should be small and live no more than a few days, they are roughly equivalent to the concept of a changeset in RTC in terms of use. They should be deleted once they have been pulled into one of the stable streams. The use of the prefixes "feature" and "bugfix" will help all viewers of repository history to quickly identify the source and intent of code, this makes the use of the naming pattern very important from a usability perspective:
   1. feature/<featureName> -
      1. for new feature development which is being targeted for the monthly release that falls after the currently named release branch
      2. should never be pulled into any branch other than develop
   2. bugfix/<bugfixName> -
      1. for post-construct fixes being applied to an existing feature in a release
      2. should never be pulled into any branch other than a release

### Installation

```
/c/Repos/springboot-junit (master)
$ git flow init

Which branch should be used for bringing forth production releases?
  - master
Branch name for production releases: [master]
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Bugfix branches? [bugfix/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
Hooks and filters directory? [C:/Repos/springboot-junit/.git/hooks]
/c/Repos/springboot-junit (develop)
$ git push origin --all

```
