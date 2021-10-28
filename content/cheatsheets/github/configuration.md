---
title: Configuration
linktitle: Configuration
type: book
date: "2019-05-05T00:00:00+01:00"
toc: false
tags:
  - GitHub

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 1
---

Git Configuration

<!--more-->

* Create a new local repository:

          $ git init

  {{% callout note %}}
  It will create the hidden .git folder which is used by git to manage the repository in your working directory
  {{% /callout %}}

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
* Setup Personal Access Token:

    - Create your Personal Access Token from the Developer settings and keep the token safe to use it for future.
    - While cloning/pulling/pushing code from remote use your username and generated token when prompted for username and password respectively.
    - If you would not like to provide credentials for every "repo" operations you could cache them. The Git credential cache runs a daemon process which caches your credentials in memory and hands them out on demand.
    ```
        $ git config --global credential.helper manager
    ```

  {{% callout note %}}
  On Windows this stores your credentials in the Windows credential store which has a Control Panel interface where you can delete or edit your stored credentials. With this store, your details are secured by your Windows login and can persist over multiple sessions.
  {{% /callout %}}

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
