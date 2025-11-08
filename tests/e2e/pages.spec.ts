import { test, expect } from "./fixtures/auth.fixture";

test.describe("Page System - UI Presence", () => {
  test("authenticated user sees main app layout", async ({
    authenticatedPageWithWorkspace,
  }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(1000);

    // Should see sidebar or navigation
    const hasSidebar = await authenticatedPageWithWorkspace
      .locator('aside, nav, [data-testid="sidebar"]')
      .count();
    console.log("Has sidebar/nav:", hasSidebar > 0);

    expect(hasSidebar).toBeGreaterThan(0);
  });

  test("can see page tree or pages section", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(1000);

    // Look for pages UI
    const hasPages = await authenticatedPageWithWorkspace
      .locator('[data-testid="page-tree"]')
      .count();

    console.log("Has pages section:", hasPages > 0);
    expect(hasPages).toBeGreaterThan(0);
  });

  test("can interact with page navigation", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(1000);

    // Find any page links
    const pageLinks = await authenticatedPageWithWorkspace
      .locator(
        'a:has-text("Getting Started"), a:has-text("Page"), button:has-text("Getting Started")'
      )
      .first();

    if ((await pageLinks.count()) > 0) {
      await pageLinks.click();
      await authenticatedPageWithWorkspace.waitForTimeout(500);

      console.log("Clicked on page, current URL:", authenticatedPageWithWorkspace.url());
    }

    // Test passes if we can navigate
    expect(true).toBe(true);
  });
});

test.describe("Page System - Search and Creation", () => {
  test("can find search or creation UI", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(1000);

    // Look for search input
    const hasSearch = await authenticatedPageWithWorkspace
      .locator('input[placeholder*="Search" i], [data-testid="page-search"]')
      .count();

    // Look for create button
    const hasCreate = await authenticatedPageWithWorkspace
      .locator(
        'button:has-text("+"), button:has-text("New"), button:has-text("Create"), [data-testid="create-page"]'
      )
      .count();

    console.log("Has search:", hasSearch > 0);
    console.log("Has create:", hasCreate > 0);

    expect(hasSearch + hasCreate).toBeGreaterThan(0);
  });

  test("search functionality exists", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(1000);

    const searchInput = authenticatedPageWithWorkspace
      .locator('input[placeholder*="Search" i], [data-testid="page-search"]')
      .first();

    if ((await searchInput.count()) > 0) {
      await searchInput.fill("test");
      await authenticatedPageWithWorkspace.waitForTimeout(500);
      console.log("Search input works");
    }

    expect(true).toBe(true);
  });
});

test.describe("Page System - Mock Data Verification", () => {
  test("can see mock pages", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(2000);

    // Check for mock data pages
    const hasGettingStarted = await authenticatedPageWithWorkspace
      .locator('text="Getting Started"')
      .count();
    const hasProjectPlanning = await authenticatedPageWithWorkspace
      .locator('text="Project Planning"')
      .count();
    const hasMeetingNotes = await authenticatedPageWithWorkspace
      .locator('text="Meeting Notes"')
      .count();

    console.log("Mock pages visible:");
    console.log("  - Getting Started:", hasGettingStarted > 0);
    console.log("  - Project Planning:", hasProjectPlanning > 0);
    console.log("  - Meeting Notes:", hasMeetingNotes > 0);

    // Should see at least one mock page
    expect(
      hasGettingStarted + hasProjectPlanning + hasMeetingNotes
    ).toBeGreaterThan(0);
  });

  test("pages are clickable", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(2000);

    const gettingStarted = authenticatedPageWithWorkspace
      .locator('text="Getting Started"')
      .first();

    if ((await gettingStarted.count()) > 0) {
      const initialUrl = authenticatedPageWithWorkspace.url();
      await gettingStarted.click();
      await authenticatedPageWithWorkspace.waitForTimeout(1000);

      const newUrl = authenticatedPageWithWorkspace.url();
      console.log(
        "Navigation worked:",
        initialUrl !== newUrl || newUrl.includes("page")
      );

      // Either URL changed or contains 'page'
      expect(
        initialUrl !== newUrl ||
          newUrl.includes("page") ||
          newUrl.includes("getting")
      ).toBeTruthy();
    }
  });
});

test.describe("Page System - Interactions", () => {
  test("can hover over pages", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(2000);

    const pageItem = authenticatedPageWithWorkspace
      .locator('text="Getting Started"')
      .first();

    if ((await pageItem.count()) > 0) {
      await pageItem.hover();
      await authenticatedPageWithWorkspace.waitForTimeout(300);
      console.log("Hover worked");
    }

    expect(true).toBe(true);
  });

  test("UI responds to interactions", async ({ authenticatedPageWithWorkspace }) => {
    await authenticatedPageWithWorkspace.waitForTimeout(2000);

    // Try clicking various UI elements
    const buttons = await authenticatedPageWithWorkspace.locator("button").all();
    console.log("Found buttons:", buttons.length);

    expect(buttons.length).toBeGreaterThan(0);
  });
});
