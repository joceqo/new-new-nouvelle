import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should show login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load and check for login form
    // The login form should have an email input with id="email"
    await page.waitForSelector('input#email', { timeout: 5000 });

    // Should show email input and continue button
    const emailInput = page.locator('input#email[type="email"]');
    const continueButton = page.locator('button:has-text("Continue with Email")');

    await expect(emailInput).toBeVisible();
    await expect(continueButton).toBeVisible();
  });

  test("using test mode login endpoint", async ({ page }) => {
    // Use test-login endpoint
    const email = `test-${Date.now()}@example.com`;

    const response = await page.request.post(
      "http://localhost:3001/auth/test-login",
      {
        data: { email },
      }
    );

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user.email).toBe(email);
  });

  test("should persist authentication with token", async ({ page }) => {
    // Login via test endpoint
    const email = `test-${Date.now()}@example.com`;

    const response = await page.request.post(
      "http://localhost:3001/auth/test-login",
      {
        data: { email },
      }
    );

    const data = await response.json();

    // Set tokens in localStorage
    await page.goto("/");
    await page.evaluate((authData) => {
      localStorage.setItem("nouvelle_auth_token", authData.token);
      localStorage.setItem("nouvelle_refresh_token", authData.refreshToken);
    }, data);

    // Reload and check if still authenticated
    await page.reload();

    // Should not redirect to login
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain("/login");
  });
});
