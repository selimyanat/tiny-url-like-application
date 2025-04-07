# 🔦 Testing Strategy
In this chapter, we outline the testing philosophy adopted in the project, focusing on resilience to change, 
maintainability, and effective integration coverage.

## 🧪 Test at the Right Level: Favor API-Level Testing Early On
When a project is in its early stages—or when it involves external dependencies like databases—it's often most effective 
to test through the API surface rather than internal modules. Why?

* API-level tests are more resilient to refactoring and evolving requirements.

* Tests that rely heavily on mocking tend to leak implementation details. This can make the test suite fragile and 
tightly coupled to the current code structure.

* Overuse of mocks is often a strong signal of tests that may break unnecessarily when business logic changes or when 
internal refactoring occurs.

### ✅ Examples from This Project
* On the frontend, the ShortUrl component is tested along with its dependencies by rendering the full module rather than 
mocking internal behavior.

* On the backend, tests are written at the controller level, validating behavior through HTTP-level interfaces instead 
of isolating internal service layers.

As always, there’s no one-size-fits-all. Unit testing internal logic is still valuable in specific cases—such as for 
complex algorithms or corner cases—where precision and edge-case coverage are important.

## 🔁 Avoid Over-Reliance on End-to-End (E2E) Tests
While E2E tests validate real-world workflows, they come with trade-offs:

* Slower feedback cycles
* Complex setup and teardown
* Flakiness in CI environments

To reduce these drawbacks, this project leverages **Consumer-Driven Contract Testing**.

### 🤝 Contract Testing: Fast, Reliable Integration Validation
Consumer-driven contract testing is a powerful approach to ensure compatibility between services—for example, 
between the frontend and backend, or between backend APIs.

Benefits:
* Detects breaking changes early, before deployment
* Runs fast, making it suitable for CI pipelines
* Reduces the need for heavy E2E coverage
* Repeatable and deterministic

This method enables teams to move independently while maintaining confidence that their interfaces remain aligned. For
more details on contract testing, refer to the [Pact documentation](https://docs.pact.io/).

## ⚖️ Summary
* Prefer API-level testing to ensure resilience to change and reduce coupling to implementation details.
* Use unit testing selectively for complex internal logic or critical algorithms.
* Favor contract testing over E2E for integration validation to keep the test suite fast, reliable, and CI-friendly.
* Aim for a testing strategy that supports fast feedback, confidence, and maintainability over time.
