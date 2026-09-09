1. Validation & Unit Testing

    Type Safety: The TypeScript compiler and Zod schemas serve as the primary defense against data regressions.

    Server Actions: Core mutation logic (like checking if a generated slug already exists before creating a notice) will be unit-tested using Vitest.

2. End-to-End (E2E) Testing

    Playwright: A lightweight E2E test suite will cover the critical paths: logging into the /adminrwa dashboard, drafting a notice, uploading a PDF, and verifying the published content appears on the public /notices route.