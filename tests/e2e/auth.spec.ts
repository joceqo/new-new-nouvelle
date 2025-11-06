import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should show login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");

    // Should redirect to login or show login
    await expect(page).toHaveURL(/\/(login|$)/);

    // Should show email input or welcome message
    const hasEmailInput = await page.locator('input[type="email"]').count();
    const hasLoginButton = await page
      .locator(
        'button:has-text("Login"), button:has-text("Continue"), button:has-text("Sign")'
      )
      .count();

    expect(hasEmailInput + hasLoginButton).toBeGreaterThan(0);
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
      localStorage.setItem("auth_token", authData.token);
      localStorage.setItem("refresh_token", authData.refreshToken);
    }, data);

    // Reload and check if still authenticated
    await page.reload();

    // Should not redirect to login
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain("/login");
  });
});
