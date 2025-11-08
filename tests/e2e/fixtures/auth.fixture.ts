import { test as base, Page } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: Page;
  authenticatedPageWithWorkspace: Page;
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
    localStorage.setItem("nouvelle_auth_token", authData.token);
    localStorage.setItem("nouvelle_refresh_token", authData.refreshToken);
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
    // User might be redirected to onboarding (new users) or authenticated layout (existing users)
    await page
      .waitForSelector('[data-testid="authenticated-layout"]', {
        timeout: 10000,
        state: "attached",
      })
      .catch(async () => {
        // If no authenticated layout, check for onboarding page or common authenticated elements
        return await Promise.race([
          page.waitForSelector('[data-testid="onboarding-page"]', {
            timeout: 10000,
          }),
          page.waitForSelector('nav, aside, [role="navigation"]', {
            timeout: 10000,
          }),
          // Also accept onboarding-specific elements
          page.waitForSelector('h1:has-text("Create a profile"), h1:has-text("Welcome")', {
            timeout: 10000,
          }),
        ]);
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

  authenticatedPageWithWorkspace: async ({ page, testUser }, use) => {
    // Login before each test
    await login(page, testUser.email);

    const API_URL = process.env.VITE_API_URL || "http://localhost:3001";
    const token = await page.evaluate(() => localStorage.getItem('nouvelle_auth_token'));

    // Create a workspace for the user using page.request for better error handling
    try {
      await page.request.post(`${API_URL}/workspaces`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        data: {
          name: "Test Workspace",
          icon: "🏢"
        },
      });
    } catch (error) {
      console.error("Failed to create workspace:", error);
      // Continue anyway - the test might still be valid
    }

    // Navigate directly to getting-started page (authenticated area)
    // This bypasses the onboarding flow
    await page.goto("/getting-started/home");

    // Wait for authenticated layout with workspace
    await page.waitForSelector('[data-testid="authenticated-layout"]', {
      timeout: 10000,
    });

    // Provide the authenticated page to the test
    await use(page);

    // Cleanup: logout after test
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  },
});

export { expect } from "@playwright/test";
