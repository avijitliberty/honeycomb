---
title: SpringBoot Junit
linktitle: SpringBoot Junit
type: book
date: "2019-05-05T00:00:00+01:00"
tags:
  - SpringBoot

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 2
---

Effective Automated Testing with SpringBoot
<!--more-->

### Overview

### Testing Pyramid

![](/images/uploads/springboot-junit-testing-pyramid.PNG)

### Unit Testing

### Component Testing

### Integration Testing

#### TestContainers

[TestContainers](https://www.testcontainers.org/) is a library for easily using Docker containers directly in your JUnit Test.
Their team has made some pre-built containers for common services like say for eg. a MySQL database.

Here's a snippet from their mission which aptly describes their purpose:

{{< hl >}} Testcontainers is a Java library that supports JUnit tests, providing lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.{{< /hl >}}

#### SpringCloud Contract

### Acceptance Testing
