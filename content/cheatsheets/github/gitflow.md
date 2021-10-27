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

For managing the release strategy in Git for my projects I'm planning on using a slightly modified version of a Gitflow workflow. If you're not familiar there's a lot of info online documenting this pattern, and Atlassian has a nice write-up on their site. By applying this workflow we hope to be able to maintain stable branches to run builds and deploys from, provide useful checkpoints to serve as a natural code review, and allow easier merges that are tied more directly to the individual delivering conflicting code.

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

### Setup

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

### Merging and Creating Monthly Release Branches

Based on the branch strategy when a release (EC or monthly) goes to production the release branch it came from should be merged to master with a tag added to the head commit of the release branch. If the release is a monthly release then the next monthly release branch should also be created. To manage these activities some scripted build tasks have been created: https://bitbucket.fusion.lmig.com/projects/USCM-CLAIMS/repos/nav/browse/GitBranchTasks
The Jenkins jobs to invoke these tasks can be invoked by any developer, however if there is a failure (the script enforces FF only merges to avoid merge commits) then the person invoking must be prepared to own cleaning it up. If the job does fail a member of app arch with admin access to the nav repo may be needed to help clean things up.

{{% callout note %}}
Before using the Jenkins job to perform the monthly construct tasks, it's a good idea to check BB and make sure the release branch to be merged to master isn't ahead of develop at all as this may cause conflicts when merging. It shouldn't be since construct happens after the production release, but as a sanity check it's a good idea to look first.
{{% /callout %}}

### Creating EC Branches

Branches for an EC (a release to production outside of the normal monthly window) can be created by any developer. You should follow the versioning strategy above and create a branch that corresponds to the monthly release being updated, this means that if you're delivering an EC for the April release, the branch should be named for April even if the actual deploy day would fall into May. You should pick the minor version 'v' based on how many off-cycle releases have been made for that month already. You can determine that by searching in Bitbucket for RELEASE tags (see image):

So using the above example, if I was creating a branch to deploy a fix to the April release I would create the branch with the name 'release/2017.04.2'. I would use that branch name regardless of whether the deploy date was in April or May, and regardless of if it were the market EC window 2, 3, or 4.
The steps to create the branch are the same as any other branch you create, the only caveat is that you should push the branch before committing any changes to it to ensure that Bitbucket can correctly apply our pull request rules for code reviews. So for our April example the steps would look like this:

| Action                                                                                                                                          | Steps                                                       |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| Checkout the previous release branch locally. If the branch no longer exists  you can checkout master, or checkout using  the release tag name. | ``` git checkout release/2017.04.1 </br> git pull ```       |
| Create the EC branch locally                                                                                                                    | ``` git checkout -b release/2017.04.2 ```                   |
| Push the EC branch to remote                                                                                                                    | ``` git push -u origin release/2017.04.2 ```                |
| Create a bugfix branch for your EC code                                                                                                         | ``` git checkout -b bugfix/TEAMNAME-1234-aprilECChanges ``` |

From here continue with normal push and PR process for delivering changes

### Features, Bugfixes, Pull Requests, and Merging

```
# Creating a Feature Branch and Pull Request
git clone
https://n0127354@bitbucket.fusion.lmig.com/scm/~n0127354/nav-gitflow-test.git
cd nav-gitflow-test/
vi file.txt
git status
git add file.txt
git status
git commit -m "fixing line 3 and updating line 4"
git push
git checkout -b feature/line4feature
git push -u origin feature/line4feature
git checkout develop
git fetch -a -p
git status
git pull
git branch -l
git branch -d feature/line4feature
```

An automated merge failure from <source-branch> to <target-branch> can be fixed using the following steps
(this is a distilled list of steps from the video above, commands issued below are also a more detailed set of instructions).
Note that Bitbucket provides instructions for dealing with the failure, but they don't work in the case where admin rules prevent you from pushing to the
target branch. This is true in the case where Navigator develop is the target branch. Because of this we must merge the changes to a feature branch and then PR them
to develop.
1. Branch feature from <target-branch> (use your story to create the branch)
2. Checkout new feature branch locally
3. git pull origin <source-branch>
4. Manually resolve merge conflict with your favorite mergetool (or just by hand)
5. Commit the merge changes
6. Push the commits to the remote feature
7. Pull Request the feature into <target-branch>

```
# Creating a Bugfix and Resolving a Merge Failure
git checkout release/2017.04
git fetch -a
git pull
git checkout -b bugfix/line3bug
vi file.txt
git commit -am "fixing line 3"
git push -u origin bugfix/line3bug
git checkout release/2017.04
git fetch
git pull
cat file.txt
git checkout develop
git checkout -b feature/line3merge
git pull origin develop
git pull origin release/2017.04
vi file.txt
git commit -am "merge resolution for line 3"
git push -u origin feature/line3merge
git checkout develop
git fetch -p
git status
git pull
```

### Cleaning up feature and bugfix branches

If you forgot to delete your feature or bugfix branch on merge, or if you never merged the branch for whatever reason, the old branches should be cleaned up. Git doesn't track who created a branch, but by looking at the last commit on all branches in the remote repo you can get an idea of who that branch likely belonged to. To generate that list you can run the following (these commands use some Linux base operations and are intended for the Git Bash Shell)

```
# fetch remote refs and prune any that are in your local but not remote
git fetch -p

# get a sorted list of all remote references and print out the last commit on each,
# you can add another grep to the end of this to filter for your name
git for-each-ref --format='%(committerdate) %09 %(authorname) %09%(refname)' | sort -k5n -k2M -k3n -k4n |grep 'remotes/origin'
```

Once you have identified branches you need to clean up you can remove them both locally and on the remote with the following

```
# remove the branch from the remote
git push origin --delete <branch_name>
# remove the local version, if this fails because the branch isn't merged you can use -D instead of -d,
# just be sure you actually want to delete it first
git branch -d <branch_name>
```
### Generating a change log for a release

The git log function can be used to generate a history of all changes in git between release tags.

```
git log --name-status RELEASE_2017_05..RELEASE_2017_06 > /d/tmp/june-release.log
```
