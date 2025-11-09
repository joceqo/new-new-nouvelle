# Testing Guide

This document explains the testing strategy and setup for the Nouvelle project.

## Testing Philosophy

We follow a **hybrid testing approach**:

1. **Integration Tests** (Current) - Fast, isolated tests using mocked dependencies
2. **E2E Tests** (Future) - Full system tests using real services

## Current Setup: Integration Tests

### Overview

Our current tests in `tests/e2e/` are actually **integration tests**, not true E2E tests. They test the API and UI interactions while mocking the Convex database layer.

### How It Works

When `TEST_MODE=true` is set:
- ✅ API endpoints work normally
- ✅ Authentication flows work (JWT, refresh tokens)
- ✅ User creation/lookup works (in-memory)
- ✅ No external database required
- ✅ Fast execution (~1-2min for full suite)

**Mocked Services:**
- Convex database (users, tokens, OTPs stored in memory)
- Email sending (OTPs logged instead of sent)

**Real Services:**
- Elysia API server
- Vite dev server (frontend)
- JWT token generation/validation
- Authentication logic

### Running Integration Tests

```bash
# Run all integration tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Test Configuration

**Key Files:**
- `playwright.config.ts` - Playwright configuration with auto-server startup
- `apps/api/.env.test` - Test environment variables
- `apps/api/src/lib/test-mocks.ts` - Convex mocks implementation
- `tests/e2e/fixtures/auth.fixture.ts` - Authentication test helpers

**Environment:**
- API Server: `http://localhost:3001` (with TEST_MODE=true)
- Web Server: `http://localhost:5173`
- Database: In-memory (mocked)

### Writing Integration Tests

```typescript
import { test, expect } from "./fixtures/auth.fixture";

test.describe("My Feature", () => {
  // Test with authenticated user
  test("should work when logged in", async ({ authenticatedPage }) => {
    // authenticatedPage is already logged in
    await authenticatedPage.goto("/my-feature");
    // ... test your feature
  });

  // Test without authentication
  test("should require login", async ({ page }) => {
    await page.goto("/my-feature");
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
```

### Current Test Status

✅ **Passing (2 tests):**
- `/auth/test-login` endpoint works
- Token persistence works

⚠️ **Failing (14 tests):**
- UI element tests (button text, navigation elements)
- These fail because UI features aren't fully implemented yet

## Future: Real E2E Tests

### When to Add E2E Tests

Add real E2E tests when:
- You need to test actual data persistence
- You need to test Convex queries/mutations
- You need to test real-time features
- You're preparing for production

### E2E Test Setup (Future)

**Requirements:**
1. Convex test instance (separate from production)
2. Test environment configuration
3. Database cleanup between tests

**Configuration:**
```bash
# apps/api/.env.e2e
NODE_ENV=production
TEST_MODE=false

# Real Convex instance for testing
CONVEX_URL=https://your-test-instance.convex.cloud

# Other real credentials
RESEND_API_KEY=re_test_key
JWT_SECRET=test-jwt-secret
FRONTEND_URL=http://localhost:5173
```

**Test Structure:**
```
tests/
├── integration/          # Current tests (mocked Convex)
│   ├── auth.spec.ts
│   ├── onboarding.spec.ts
│   └── pages.spec.ts
└── e2e/                  # Future tests (real Convex)
    ├── critical-flows.spec.ts
    └── smoke.spec.ts
```

**Recommended E2E Tests:**
- User registration → workspace creation → first page creation
- Login → navigate → create page → edit → save
- Token refresh → session persistence
- 2-3 critical business flows only

### Migration Path

1. ✅ **Phase 1 (Current)**: Integration tests with mocks
2. **Phase 2**: Set up Convex test instance
3. **Phase 3**: Create `tests/e2e/` folder with real E2E tests
4. **Phase 4**: Rename `tests/e2e/` to `tests/integration/`
5. **Phase 5**: Run both test suites in CI

## Best Practices

### Integration Tests (Current)

✅ **Do:**
- Test API endpoints
- Test authentication flows
- Test UI rendering and interactions
- Use mocks for fast execution
- Run frequently during development

❌ **Don't:**
- Test real data persistence (mocked)
- Test Convex-specific features
- Test real-time updates
- Expect data to survive between test runs

### E2E Tests (Future)

✅ **Do:**
- Test critical user flows end-to-end
- Test actual data persistence
- Test real integrations
- Run before releases
- Clean up test data after each test

❌ **Don't:**
- Test every edge case (use integration tests)
- Run too many (slow and expensive)
- Share data between tests
- Run constantly (save for CI/pre-release)

## Troubleshooting

### Tests Fail with "Connection Refused"

**Problem:** Servers aren't starting.

**Solution:**
```bash
# Kill any stuck processes
pkill -f "playwright"
pkill -f "bun --watch"
pkill -f "vite"

# Try again
npm run test:e2e
```

### Tests Fail with "Test login failed: Not Found"

**Problem:** TEST_MODE isn't set properly.

**Solution:**
- Check `apps/api/.env.test` exists
- Verify API logs show "Running in TEST MODE"
- Restart test run

### Tests Timeout

**Problem:** UI elements not rendering or different from expected.

**Solution:**
- Check error screenshots in `test-results/`
- Verify element selectors match actual UI
- Increase timeout if needed
- Check if feature is implemented

## Summary

| Aspect | Integration (Current) | E2E (Future) |
|--------|----------------------|---------------|
| **Speed** | Fast (~1-2min) | Slow (~5-10min) |
| **Dependencies** | None (mocked) | Convex + all services |
| **Data** | In-memory | Real database |
| **When to Run** | Every commit | Before releases |
| **Purpose** | Development | Validation |
| **Cost** | Free | Requires infrastructure |

## Next Steps

1. ✅ Integration tests are working
2. Implement missing UI features to make more tests pass
3. When ready for production, set up Convex test instance
4. Create separate E2E test suite
5. Run both in CI pipeline

---

**Questions?** Check the test files or ask the team!
