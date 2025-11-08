# E2E Testing with Playwright

## Overview

This directory contains end-to-end tests for the Nouvelle app using Playwright.

## Test Structure

```
tests/e2e/
├── fixtures/
│   └── auth.fixture.ts      # Authentication helpers and fixtures
├── auth.spec.ts             # Authentication flow tests
├── onboarding.spec.ts       # Onboarding and workspace tests
├── pages.spec.ts            # Page system tests
└── README.md                # This file
```

## Running Tests

### Run all tests

```bash
pnpm test:e2e
```

### Run in UI mode (recommended for development)

```bash
pnpm test:e2e:ui
```

### Run specific test file

```bash
pnpm test:e2e tests/e2e/auth.spec.ts
```

### Run in headed mode (see browser)

```bash
pnpm test:e2e --headed
```

### Debug tests

```bash
pnpm test:e2e --debug
```

## Prerequisites

### 1. Test Mode for API

To make tests work, you need to enable a test mode in your API that accepts a fixed OTP code (`123456`).

Add this to `apps/api/src/lib/otp.ts`:

```typescript
export function generateOTP(email: string): string {
  // In test mode, always return 123456
  if (process.env.NODE_ENV === "test" || process.env.TEST_MODE === "true") {
    return "123456";
  }

  // Production: generate random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function verifyOTP(
  email: string,
  code: string,
  storedCode: string
): boolean {
  // In test mode, always accept 123456
  if (process.env.NODE_ENV === "test" || process.env.TEST_MODE === "true") {
    return code === "123456";
  }

  // Production: verify against stored code
  return code === storedCode;
}
```

Then update your API server start command:

```bash
# In package.json
"dev:api:test": "TEST_MODE=true cd apps/api && pnpm run dev"
```

### 2. Health Check Endpoint

Add a health check endpoint to your API for Playwright to verify the server is ready:

```typescript
// apps/api/src/index.ts
app.get("/health", () => ({ status: "ok" }));
```

### 3. Test Environment Variables

Create `.env.test` files if needed:

```bash
# apps/api/.env.test
NODE_ENV=test
TEST_MODE=true
PORT=3001
JWT_SECRET=test-secret-key

# apps/web/.env.test
VITE_API_URL=http://localhost:3001
```

## Test Fixtures

### Authentication Fixture

Located in `fixtures/auth.fixture.ts`, this provides:

- `testUser` - Automatically generated test user with unique email
- `authenticatedPage` - Pre-authenticated browser page ready for testing

Example usage:

```typescript
import { test, expect } from "./fixtures/auth.fixture";

test("user can do something", async ({ authenticatedPage, testUser }) => {
  // authenticatedPage is already logged in
  // testUser contains the email and name
  await expect(authenticatedPage.locator("h1")).toBeVisible();
});
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";

test("describe what this tests", async ({ page }) => {
  // Arrange
  await page.goto("/some-route");

  // Act
  await page.click('button:has-text("Click Me")');

  // Assert
  await expect(page.locator('text="Success"')).toBeVisible();
});
```

### Using Authentication Fixture

```typescript
import { test, expect } from "./fixtures/auth.fixture";

test("authenticated user test", async ({ authenticatedPage }) => {
  // User is already logged in
  await expect(
    authenticatedPage.locator('[data-testid="user-menu"]')
  ).toBeVisible();
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors:

   ```tsx
   <button data-testid="create-page-button">Create Page</button>
   ```

   ```typescript
   await page.click('[data-testid="create-page-button"]');
   ```

2. **Wait for elements** before interacting:

   ```typescript
   await page.waitForSelector('[data-testid="modal"]');
   await page.click('[data-testid="submit"]');
   ```

3. **Use specific locators** over generic ones:

   ```typescript
   // Good
   await page.click('[data-testid="create-page"]');

   // Bad (can be fragile)
   await page.click("button:nth-child(3)");
   ```

4. **Test user flows, not implementation**:

   ```typescript
   // Good - tests what the user does
   test('user can create a page', async ({ authenticatedPage }) => {
     await authenticatedPage.click('[data-testid="create-page"]');
     await expect(authenticatedPage.locator('text="Untitled"')).toBeVisible();
   });

   // Bad - tests implementation details
   test('createPage function gets called', async () => { ... });
   ```

## Adding Test IDs to Your Components

Add `data-testid` attributes to key elements:

```tsx
// Sidebar
<div data-testid="sidebar">
  <div data-testid="page-tree">
    <button data-testid="create-page">+</button>
    <input data-testid="page-search" placeholder="Search pages..." />
  </div>
</div>

// Page View
<div data-testid="page-view">
  <h1 data-testid="page-title">{title}</h1>
</div>

// User Menu
<button data-testid="user-menu">
  Profile
</button>

// Workspace Switcher
<button data-testid="workspace-switcher">
  {activeWorkspace.name}
</button>
```

## Debugging Tests

### 1. Run in UI Mode

```bash
pnpm test:e2e:ui
```

This opens Playwright's UI where you can:

- See tests run in real-time
- Pause and inspect at any point
- View screenshots and traces
- Rerun failed tests

### 2. Use Debug Mode

```bash
pnpm test:e2e --debug
```

Opens Playwright Inspector for step-by-step debugging.

### 3. View Test Results

After running tests, view the HTML report:

```bash
pnpm test:e2e:report
```

### 4. Screenshots and Videos

Failed tests automatically capture:

- Screenshots (in `test-results/`)
- Videos (in `test-results/`)
- Traces (in `test-results/`)

View traces with:

```bash
npx playwright show-trace test-results/.../trace.zip
```

## Continuous Integration

Add to your CI workflow (e.g., GitHub Actions):

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          TEST_MODE: true

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Common Issues

### Tests timing out

- Increase timeout in `playwright.config.ts`
- Check if API server is running
- Check if web server is running

### "Element not found" errors

- Add explicit waits: `await page.waitForSelector(...)`
- Check if element has correct data-testid
- Use Playwright Inspector to see what's on the page

### Authentication not working

- Verify TEST_MODE is enabled in API
- Check OTP code is '123456' in test mode
- Check JWT_SECRET is set

### Flaky tests

- Add explicit waits instead of timeouts
- Use `waitForURL`, `waitForSelector` with good timeouts
- Avoid `page.waitForTimeout()` - use conditions instead

## Test Coverage

Current test coverage includes:

- ✅ Authentication flow (login, OTP verification, logout)
- ✅ Email validation
- ✅ Session persistence
- ✅ Onboarding for new users
- ✅ Workspace creation and switching
- ✅ Member invitations
- ✅ Page creation and navigation
- ✅ Page search and filtering
- ✅ Favorites system
- ✅ Nested pages
- ✅ Page renaming and deletion
- ✅ Tree expand/collapse
- ✅ URL sharing

## Next Steps

1. Add visual regression testing
2. Add performance tests (Lighthouse CI)
3. Add accessibility tests (@axe-core/playwright)
4. Add API contract tests
5. Add database seeding for consistent test data
6. Add parallel test execution strategies

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Test Generator](https://playwright.dev/docs/codegen) - `npx playwright codegen`
