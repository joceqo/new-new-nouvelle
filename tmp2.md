    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/pages-Page-System---Interactions-can-hover-over-pages-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

15. [chromium] › tests/e2e/pages.spec.ts:164:7 › Page System - Interactions › UI responds to interactions


    Error: Test login failed: Too Many Requests

       at fixtures/auth.fixture.ts:37

      35 |
      36 |   if (!response.ok) {
    > 37 |     throw new Error(`Test login failed: ${response.statusText}`);
         |           ^
      38 |   }
      39 |
      40 |   const data = (await response.json()) as TestLoginResponse;
        at login (/Users/jocelin/Desktop/coding/important/new-new-nouvelle/tests/e2e/fixtures/auth.fixture.ts:37:11)
        at Object.authenticatedPage (/Users/jocelin/Desktop/coding/important/new-new-nouvelle/tests/e2e/fixtures/auth.fixture.ts:76:5)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/pages-Page-System---Interactions-UI-responds-to-interactions-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/pages-Page-System---Interactions-UI-responds-to-interactions-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

15 failed
[chromium] › tests/e2e/auth.spec.ts:4:7 › Authentication Flow › should show login page for unauthenticated users
[chromium] › tests/e2e/auth.spec.ts:21:7 › Authentication Flow › using test mode login endpoint
[chromium] › tests/e2e/onboarding.spec.ts:4:7 › Onboarding Flow › authenticated user without workspace sees onboarding
[chromium] › tests/e2e/onboarding.spec.ts:24:7 › Onboarding Flow › user can create a workspace ─
[chromium] › tests/e2e/onboarding.spec.ts:71:7 › Workspace Management › authenticated user can access workspace
[chromium] › tests/e2e/onboarding.spec.ts:91:7 › Workspace Management › can navigate within authenticated area
[chromium] › tests/e2e/pages.spec.ts:4:7 › Page System - UI Presence › authenticated user sees main app layout
[chromium] › tests/e2e/pages.spec.ts:18:7 › Page System - UI Presence › can see page tree or pages section
[chromium] › tests/e2e/pages.spec.ts:32:7 › Page System - UI Presence › can interact with page navigation
[chromium] › tests/e2e/pages.spec.ts:55:7 › Page System - Search and Creation › can find search or creation UI
[chromium] › tests/e2e/pages.spec.ts:76:7 › Page System - Search and Creation › search functionality exists
[chromium] › tests/e2e/pages.spec.ts:94:7 › Page System - Mock Data Verification › can see mock pages
[chromium] › tests/e2e/pages.spec.ts:119:7 › Page System - Mock Data Verification › pages are clickable
[chromium] › tests/e2e/pages.spec.ts:148:7 › Page System - Interactions › can hover over pages ─
[chromium] › tests/e2e/pages.spec.ts:164:7 › Page System - Interactions › UI responds to interactions
1 passed (5.3s)

Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
^C%
