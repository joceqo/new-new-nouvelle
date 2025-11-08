# Testing Guide

## Overview

This project uses **Playwright** for end-to-end integration testing. The tests cover the entire user journey from authentication through to page management.

## ✅ What's Covered

### Authentication Tests (`tests/e2e/auth.spec.ts`)

- ✅ Login page display for unauthenticated users
- ✅ Email validation
- ✅ OTP code sending and verification
- ✅ Invalid OTP handling
- ✅ Session persistence across page reloads
- ✅ Logout functionality

### Onboarding Tests (`tests/e2e/onboarding.spec.ts`)

- ✅ New users see onboarding
- ✅ Workspace creation during onboarding
- ✅ Existing users skip onboarding
- ✅ Creating additional workspaces
- ✅ Switching between workspaces
- ✅ Inviting members to workspaces

### Page System Tests (`tests/e2e/pages.spec.ts`)

- ✅ Page tree visibility in sidebar
- ✅ Creating new pages
- ✅ Navigating to pages
- ✅ Searching for pages
- ✅ Favoriting pages
- ✅ Creating nested pages
- ✅ Renaming pages
- ✅ Deleting pages
- ✅ Expanding/collapsing page tree
- ✅ Shareable URLs
- ✅ Browser navigation (back/forward)

---

## 🚀 Quick Start

### 1. Enable Test Mode in API

First, you need to enable test mode so the API accepts a predictable OTP code.

**Update `apps/api/src/lib/otp.ts`**:

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
  if (
    (process.env.NODE_ENV === "test" || process.env.TEST_MODE === "true") &&
    code === "123456"
  ) {
    return true;
  }

  // Production: verify against stored code
  return code === storedCode;
}
```

### 2. Add Health Check Endpoint

**Update `apps/api/src/index.ts`**:

```typescript
// Add health check endpoint for Playwright
app.get("/health", () => ({ status: "ok", timestamp: Date.now() }));
```

### 3. Add Test IDs to Components

For more reliable tests, add `data-testid` attributes to key UI elements:

**Example in `AuthenticatedLayout.tsx`**:

```tsx
<div className="flex h-screen bg-background" data-testid="authenticated-layout">
  <Sidebar data-testid="sidebar">
    <PageTree
      data-testid="page-tree"
      // ...
    />
  </Sidebar>
</div>
```

**Example in `PageView.tsx`**:

```tsx
<div data-testid="page-view">
  <h1 data-testid="page-title">{title}</h1>
</div>
```

### 4. Run Tests

```bash
# Run all tests
pnpm test:e2e

# Run in interactive UI mode (recommended!)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Debug a specific test
pnpm test:e2e:debug

# Generate tests by recording your actions
pnpm test:e2e:codegen
```

---

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";

test("descriptive test name", async ({ page }) => {
  // 1. Navigate
  await page.goto("/some-route");

  // 2. Interact
  await page.click('[data-testid="button"]');

  // 3. Assert
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

### Using Authentication Fixture

For tests that require a logged-in user:

```typescript
import { test, expect } from "./fixtures/auth.fixture";

test("authenticated user can do something", async ({
  authenticatedPage,
  testUser,
}) => {
  // User is already logged in
  // authenticatedPage is ready to use

  await expect(authenticatedPage.locator("h1")).toContainText("Dashboard");
  console.log("Testing as:", testUser.email);
});
```

### Best Practices

1. **Use data-testid for stable selectors**:

   ```tsx
   // In component
   <button data-testid="create-page">Create</button>;

   // In test
   await page.click('[data-testid="create-page"]');
   ```

2. **Wait for conditions, not fixed times**:

   ```typescript
   // ❌ Bad
   await page.waitForTimeout(3000);

   // ✅ Good
   await page.waitForSelector('[data-testid="modal"]');
   await page.waitForURL("/dashboard");
   ```

3. **Test user behavior, not implementation**:

   ```typescript
   // ❌ Bad - tests implementation
   test('createPage function is called', ...);

   // ✅ Good - tests user flow
   test('user can create a new page', ...);
   ```

4. **Use descriptive test names**:

   ```typescript
   // ❌ Bad
   test('test 1', ...);

   // ✅ Good
   test('user can favorite a page and see star icon', ...);
   ```

---

## 🐛 Debugging Tests

### Method 1: UI Mode (Easiest)

```bash
pnpm test:e2e:ui
```

This opens Playwright's test UI where you can:

- See tests run in real-time
- Pause and step through tests
- Inspect element locators
- See console logs and network requests

### Method 2: Debug Mode

```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Method 3: Headed Mode

```bash
pnpm test:e2e:headed
```

Runs tests in a visible browser window.

### Method 4: Screenshots and Videos

Failed tests automatically capture:

- **Screenshots**: `test-results/.../screenshot.png`
- **Videos**: `test-results/.../video.webm`
- **Traces**: `test-results/.../trace.zip`

View traces with:

```bash
npx playwright show-trace test-results/.../trace.zip
```

### Method 5: Add Debugging Statements

```typescript
test("my test", async ({ page }) => {
  // Pause execution
  await page.pause();

  // Take a screenshot
  await page.screenshot({ path: "debug.png" });

  // Log element text
  const text = await page.locator("h1").textContent();
  console.log("Title:", text);

  // Inspect locator
  await page.locator('[data-testid="button"]').highlight();
});
```

---

## 🔧 Test Configuration

The test configuration is in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests/e2e',           // Where tests are located
  fullyParallel: true,               // Run tests in parallel
  retries: process.env.CI ? 2 : 0,  // Retry failed tests on CI
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',         // Capture trace on retry
    screenshot: 'only-on-failure',   // Screenshots on failure
    video: 'retain-on-failure',      // Videos on failure
  },
  webServer: [
    // Starts API and web servers automatically
    { command: 'cd apps/api && pnpm run dev', ... },
    { command: 'cd apps/web && pnpm run dev', ... },
  ],
});
```

---

## 🎯 Test Fixtures

### Authentication Fixture

Located in `tests/e2e/fixtures/auth.fixture.ts`, provides:

**`testUser`** - Automatically generated unique test user:

```typescript
{
  email: `test-${Date.now()}@example.com`,
  name: 'Test User'
}
```

**`authenticatedPage`** - Pre-authenticated browser page:

- Logs in the user automatically before each test
- Clears storage after each test for isolation

Usage:

```typescript
test("my test", async ({ authenticatedPage, testUser }) => {
  // Page is already authenticated
  console.log("Testing as:", testUser.email);
  await authenticatedPage.goto("/dashboard");
});
```

---

## 🚨 Common Issues & Solutions

### Issue: Tests timing out

**Solution**:

```typescript
// Increase timeout for specific test
test("slow test", async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});

// Or in config
export default defineConfig({
  timeout: 30000, // 30 seconds per test
});
```

### Issue: "Element not found" errors

**Solutions**:

1. Add explicit waits:

   ```typescript
   await page.waitForSelector('[data-testid="element"]');
   ```

2. Check selector:

   ```typescript
   // Debug what's on the page
   await page.screenshot({ path: "debug.png", fullPage: true });
   ```

3. Use Playwright Inspector:
   ```bash
   pnpm test:e2e:debug
   ```

### Issue: Flaky tests (sometimes pass, sometimes fail)

**Solutions**:

1. Use conditions instead of timeouts:

   ```typescript
   // ❌ Flaky
   await page.waitForTimeout(1000);
   await page.click("button");

   // ✅ Reliable
   await page.waitForSelector("button");
   await page.click("button");
   ```

2. Wait for network idle:

   ```typescript
   await page.goto("/page", { waitUntil: "networkidle" });
   ```

3. Use retry assertions:
   ```typescript
   await expect(page.locator("div")).toHaveText("Expected", {
     timeout: 10000,
   });
   ```

### Issue: Authentication not working in tests

**Checklist**:

- ✅ `TEST_MODE=true` environment variable set
- ✅ API is returning '123456' as OTP in test mode
- ✅ OTP verification accepts '123456' in test mode
- ✅ Health check endpoint exists (`/health`)
- ✅ API server is starting before tests

### Issue: Tests work locally but fail in CI

**Common causes**:

- Different Node.js or pnpm versions
- Missing environment variables
- Timing differences (CI is slower)
- Browser differences

**Solutions**:

- Use same Node/pnpm versions in CI as locally
- Set all environment variables in CI workflow
- Increase timeouts for CI
- Only test on Chromium for consistency

---

## 🔄 Continuous Integration

Tests run automatically on GitHub Actions for:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

See `.github/workflows/e2e-tests.yml` for the configuration.

**Viewing Test Results**:

1. Go to Actions tab in GitHub
2. Click on the workflow run
3. Download `playwright-report` artifact
4. Extract and open `index.html` in browser

---

## 📊 Test Reports

After running tests, view the HTML report:

```bash
pnpm test:e2e:report
```

This shows:

- ✅ Passed tests
- ❌ Failed tests
- ⏭️ Skipped tests
- 📷 Screenshots
- 🎥 Videos
- 📊 Test duration

---

## 🎓 Learning Resources

- **Playwright Docs**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Selectors Guide**: https://playwright.dev/docs/selectors
- **Debugging Guide**: https://playwright.dev/docs/debug
- **Test Generator**: `pnpm test:e2e:codegen`

---

## 📈 Next Steps

### Improve Test Coverage

- [ ] Add accessibility tests (axe-core)
- [ ] Add visual regression tests
- [ ] Add API integration tests
- [ ] Add mobile viewport tests
- [ ] Add tests for error states

### Improve Test Infrastructure

- [ ] Set up test database with seeded data
- [ ] Add test user management
- [ ] Implement test data factories
- [ ] Add parallel execution strategies
- [ ] Set up test sharding for faster CI

### Add More Test Types

- [ ] Unit tests (Vitest)
- [ ] Component tests (Testing Library)
- [ ] Performance tests (Lighthouse CI)
- [ ] Load tests (k6)

---

## 💡 Tips

1. **Run tests often** - Don't wait until everything is done
2. **Test in UI mode** - Much easier to debug than headless
3. **Use codegen** - `pnpm test:e2e:codegen` to generate test code
4. **Keep tests independent** - Each test should work in isolation
5. **Name tests clearly** - Future you will thank you
6. **Add data-testid** - Makes tests more stable
7. **Watch for flakiness** - If a test fails randomly, fix it immediately

---

## 🎉 You're All Set!

Start by running:

```bash
pnpm test:e2e:ui
```

This will open Playwright's UI where you can see all tests and run them interactively.

Happy testing! 🚀
