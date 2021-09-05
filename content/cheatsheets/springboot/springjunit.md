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

Automated Testing with SpringBoot
<!--more-->

### Overview

Spring Boot offers great support to test different slices (web, database, etc.) of your application. This allows you to write tests for specific parts of your application in isolation without bootstrapping the whole Spring Context. Technically this is achieved by creating a Spring Context with only a subset of beans by applying only specific auto-configurations.

### Testing Pyramid

![](/images/uploads/springboot-junit-testing-pyramid.PNG)

### Unit Testing

We should be able to write unit tests for UserService WITHOUT using any Spring features.
We are going to create a mock repository using Mockito.mock() and create Service instance using the mock repository instance.

### Component Testing

#### Web Layer

Using @WebMvcTest annotation, you'll get a Spring Context that includes components required for testing Spring MVC parts of your application.

What's part of the Spring Test Context: @Controller, @ControllerAdvice, @JsonComponent, @Converter, @Filter, @WebMvcConfigurer.

What's not part of the Spring Test Context: @Service, @Component, @Repository beans

Furthermore, there is also great support if you secure your endpoints with Spring Security. The annotation will auto-configure your security rules, and if you include the Spring Security Test dependency, you can easily mock the authenticated user. As this annotation provides a mocked servlet environment, there is no port to access your application with, e.g., a RestTemplate. Therefore, you rather use the auto-configured MockMvc to access your endpoints:

```java
@WebMvcTest(ShoppingCartController.class)
class ShoppingCartControllerTest {


  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private ShoppingCartRepository shoppingCartRepository;

  @Test
  public void shouldReturnAllShoppingCarts() throws Exception {
    when(shoppingCartRepository.findAll()).thenReturn(
      List.of(new ShoppingCart("42",
        List.of(new ShoppingCartItem(
          new Item("MacBook", 999.9), 2)
        ))));

    this.mockMvc.perform(get("/api/carts"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].id", Matchers.is("42")))
      .andExpect(jsonPath("$[0].cartItems.length()", Matchers.is(1)))
      .andExpect(jsonPath("$[0].cartItems[0].item.name", Matchers.is("MacBook")))
      .andExpect(jsonPath("$[0].cartItems[0].quantity", Matchers.is(2)));
  }
}
```

#### JPA Components

With @DataJpaTest you can test any JPA-related parts of your application. A good example is to verify that a native query is working as expected.

What's part of the Spring Test Context: @Repository, EntityManager, TestEntityManager, DataSource

What's not part of the Spring Test Context: @Service, @Component, @Controller beans

By default, this annotation tries to auto-configure use an embedded database (e.g., H2) as the DataSource:

```java
@DataJpaTest
class BookRepositoryTest {

  @Autowired
  private DataSource dataSource;

  @Autowired
  private EntityManager entityManager;

  @Autowired
  private BookRepository bookRepository;

  @Test
  public void testCustomNativeQuery() {
    assertEquals(1, bookRepository.findAll().size());

    assertNotNull(dataSource);
    assertNotNull(entityManager);
  }
}
```

While an in-memory database might not be a good choice to verify a native query using proprietary features, you can disable this auto-configuration with:

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
and use, e.g., Testcontainers to create a PostgreSQL database for testing. This would be more akin to Integration testing and we would discuss that in a following section.

In addition to the auto-configuration, all tests run inside a transaction and get rolled back after their execution.

#### Cross Cutting concerns

### Integration Testing

#### TestContainers

[TestContainers](https://www.testcontainers.org/) is a library for easily using Docker containers directly in your JUnit Test.
Their team has made some pre-built containers for common services like say for eg. a MySQL database.

Here's a snippet from their mission which aptly describes their purpose:

{{< hl >}} Testcontainers is a Java library that supports JUnit tests, providing lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.{{< /hl >}}

#### SpringCloud Contract

### Acceptance Testing
