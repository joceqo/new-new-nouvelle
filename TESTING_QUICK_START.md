# Testing Quick Start 🚀

## TL;DR

```bash
# 1. Set test mode
export TEST_MODE=true

# 2. Run tests (will auto-start servers)
pnpm test:e2e

# 3. View report
pnpm test:e2e:report
```

That's it! Tests run fully automated in the background.

---

## What Happens When You Run Tests

1. **Servers Start Automatically**
   - API server starts on port 3001
   - Web app starts on port 5173
   - Playwright waits for both to be ready

2. **Tests Run in Background**
   - Browser runs headless (invisible)
   - Tests create users automatically via test endpoint
   - Tests interact with your UI
   - Screenshots/videos captured on failure

3. **Report Generated**
   - HTML report created in `playwright-report/`
   - Test results logged to console
   - Failed tests show detailed errors

---

## Commands

```bash
# Run all tests (background, headless)
pnpm test:e2e

# View last report in browser
pnpm test:e2e:report

# See tests in UI (interactive)
pnpm test:e2e:ui

# Watch browser (headed mode)
pnpm test:e2e:headed

# Debug a specific test
pnpm test:e2e tests/e2e/auth.spec.ts --debug
```

---

## How It Works

### 1. Test Mode Endpoint

The API has a special `/auth/test-login` endpoint that only works when `TEST_MODE=true`:

```typescript
// Automatically creates user and returns auth token
POST /auth/test-login
{
  "email": "test@example.com"
}

// Response
{
  "success": true,
  "token": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

### 2. Test Fixture

The `authenticatedPage` fixture automatically:

- Creates a unique test user
- Logs them in via test endpoint
- Provides authenticated page to your test
- Cleans up after test completes

Example test:

```typescript
import { test, expect } from "./fixtures/auth.fixture";

test("user can see dashboard", async ({ authenticatedPage }) => {
  // User is already logged in!
  await expect(authenticatedPage.locator("h1")).toBeVisible();
});
```

### 3. Mock Data

The PageProvider currently shows mock data:

- "Getting Started" (favorited)
- "Project Planning"
- "Meeting Notes" (nested)

Tests verify these pages are visible and clickable.

---

## Test Coverage

**✅ Authentication** (3 tests)

- Login page display
- Test mode login
- Token persistence

**✅ Onboarding** (4 tests)

- Workspace creation
- Authenticated access
- Navigation

**✅ Pages** (13 tests)

- Sidebar visibility
- Page tree display
- Mock data verification
- Page navigation
- Search UI
- Hover interactions

---

## Viewing Test Results

### Console Output

```bash
pnpm test:e2e
```

Shows:

```
Running 20 tests using 4 workers

  ✓ auth.spec.ts:5:5 › should show login page (1.2s)
  ✓ auth.spec.ts:15:5 › using test mode login (0.8s)
  ...

  20 passed (45.3s)
```

### HTML Report

```bash
pnpm test:e2e:report
```

Opens browser with:

- ✅ Passed tests
- ❌ Failed tests (with screenshots, videos, traces)
- 📊 Duration charts
- 🔍 Detailed error messages

### Failed Test Artifacts

When a test fails, check `test-results/`:

```
test-results/
├── screenshot.png       # What the page looked like
├── video.webm          # Recording of the test
└── trace.zip           # Detailed trace file
```

View trace:

```bash
npx playwright show-trace test-results/.../trace.zip
```

---

## CI/CD

Tests run automatically on GitHub:

- ✅ Push to main/develop
- ✅ Pull requests
- ✅ Upload test results as artifacts

See `.github/workflows/e2e-tests.yml`

---

## Troubleshooting

### Tests timeout

**Problem**: Tests hang and timeout

**Solution**:

```bash
# Check if servers are running
curl http://localhost:3001/health
curl http://localhost:5173

# If not, start manually first
pnpm dev:api &
pnpm dev:web &

# Then run tests without auto-start
pnpm test:e2e
```

### "Test login failed"

**Problem**: Test endpoint not working

**Check**:

1. `TEST_MODE=true` is set
2. API server is running
3. Test endpoint exists: `curl -X POST http://localhost:3001/auth/test-login -d '{"email":"test@example.com"}'`

### Tests pass locally but fail in CI

**Common causes**:

- Missing `TEST_MODE=true` in CI
- Different timing (CI is slower)
- Environment variables not set

**Solution**: Check `.github/workflows/e2e-tests.yml` has:

```yaml
env:
  TEST_MODE: true
  NODE_ENV: test
```

### Want to see what's happening?

**Use headed mode**:

```bash
pnpm test:e2e:headed
```

Or **UI mode** (best for debugging):

```bash
pnpm test:e2e:ui
```

---

## Next Steps

### Add More Tests

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from "./fixtures/auth.fixture";

test("my feature works", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/my-feature");
  await expect(authenticatedPage.locator("h1")).toContainText("My Feature");
});
```

### Add Test IDs

```tsx
// In your components
<button data-testid="create-page">Create</button>;

// In your tests
await page.click('[data-testid="create-page"]');
```

### Connect Real Data

Once you hook up real API:

1. Tests will work with actual data
2. Create test fixtures for consistent data
3. Add database seeding

---

## Pro Tips

1. **Use UI Mode for Development**

   ```bash
   pnpm test:e2e:ui
   ```

   Watch tests run, pause, inspect elements

2. **Run Single Test**

   ```bash
   pnpm test:e2e -g "login page"
   ```

3. **Update Snapshots** (if using visual testing)

   ```bash
   pnpm test:e2e --update-snapshots
   ```

4. **Generate Tests** (record your actions)

   ```bash
   pnpm test:e2e:codegen
   ```

5. **Check Coverage**
   Tests cover:
   - ✅ Happy paths
   - ❌ Error cases
   - 🔄 State persistence
   - 🎯 User interactions

---

## Summary

Your tests are **fully automated**:

- ✅ No manual OTP entry
- ✅ No manual server starting (auto-start)
- ✅ No manual cleanup
- ✅ Runs in background
- ✅ Generates reports
- ✅ Works in CI/CD

Just run `pnpm test:e2e` and let it do its thing! 🎉

For detailed documentation, see `TESTING_GUIDE.md`
