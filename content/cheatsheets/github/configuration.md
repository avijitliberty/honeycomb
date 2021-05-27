---
title: Configuration
linktitle: Configuration
type: book
date: "2019-05-05T00:00:00+01:00"
tags:
  - GitHub

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 1
---

Git Configuration

<!--more-->

* Create a new local repository:

  > Note: It will create the hidden .git folder which is used by git to manage the repository in your working directory

          $ git init
* Configure the author name and email address to be used with your commits:

          $ git config --global user.name "LAST_NAME.FIRST_NAME"
          $ git config --global user.email "WORK_EMAIL"
* Normalize your line endings:

          $ git config --global core.autocrlf false
* Colorized output:

          $ git config --global color.ui auto
* Setup KDiff as the merge tool:

          $ git config --global --add merge.tool kdiff3
          $ git config --global --add mergetool.kdiff3.path "C:/Program Files/KDiff3/kdiff3.exe"
* Setup proxies to work with Git:
    * Option1: Git Proxy without Cntlm: (Not secure as our credentials are being sent "over the wire")
    ```
        $ git config --global http.proxy http://MyUserID:MyPassword@www-proxy.company.com:80
        $ git config --global https.proxy http://MyUserID:MyPassword@www-proxy.company.com:80
    ```
    * Option2: Git Proxy w/ Cntlm: (Safe since our passwords are encrypted. Generic enough to be used with a host of tools like NPM, Git, AWS, Eclipse, Docker etc.)
    ```
        $ git config --global http.proxy http://localhost:3128
        $ git config --global https.proxy http://localhost:3128
    ```
* Display current settings:
    ```
        git config --list
    ```
> Note: More info here: <http://git-scm.com/docs/git-config>
