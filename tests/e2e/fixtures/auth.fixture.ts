import { test as base, Page } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: Page;
  testUser: {
    email: string;
    name: string;
  };
};

interface TestLoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

/**
 * Login helper function using test mode endpoint
 */
async function login(page: Page, email: string): Promise<void> {
  // Use the test-login endpoint to get auth token directly
  const API_URL = process.env.VITE_API_URL || "http://localhost:3001";

  const response = await fetch(`${API_URL}/auth/test-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Test login failed: ${response.statusText}`);
  }

  const data = (await response.json()) as TestLoginResponse;

  if (!data.success || !data.token) {
    throw new Error("Test login did not return valid token");
  }

  // Set the auth token in localStorage
  await page.goto("/");

  await page.evaluate((authData: TestLoginResponse) => {
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("refresh_token", authData.refreshToken);
    localStorage.setItem("user", JSON.stringify(authData.user));
  }, data);

  // Navigate to the app - should now be authenticated
  await page.goto("/");

  // Wait for authentication to be recognized
  await page.waitForTimeout(500);
}

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use) => {
    const user = {
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
    };
    await use(user);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Login before each test
    await login(page, testUser.email);

    // Wait for authentication to complete
    await page
      .waitForSelector('[data-testid="authenticated-layout"]', {
        timeout: 10000,
        state: "attached",
      })
      .catch(() => {
        // If no test id, check for common authenticated elements
        return page.waitForSelector('nav, aside, [role="navigation"]', {
          timeout: 10000,
        });
      });

    // Provide the authenticated page to the test
    await use(page);

    // Cleanup: logout after test
    // This ensures each test starts fresh
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  },
});

export { expect } from "@playwright/test";
