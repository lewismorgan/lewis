import { defineConfig, devices } from '@playwright/test'

import { VERCEL_BYPASS_STATE } from './test/global-setup'

/**
 * Set PLAYWRIGHT_BASE_URL to run against a deployed site (Vercel preview or
 * production) instead of a local `pnpm dev` server.
 */
const remoteURL = process.env.PLAYWRIGHT_BASE_URL
const useBypass = !!remoteURL && !!process.env.VERCEL_AUTOMATION_BYPASS_SECRET

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './test',
  globalSetup: './test/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  maxFailures: process.env.CI ? 5 : 0,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'dot' : [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: remoteURL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    /* Vercel protection bypass cookie, written by global-setup */
    storageState: useBypass ? VERCEL_BYPASS_STATE : undefined,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests (local target only) */
  webServer: remoteURL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        env: {
          ...process.env,
          SKIP_ENV_VALIDATION: 'false',
          VERCEL_GIT_COMMIT_SHA:
            process.env.VERCEL_GIT_COMMIT_SHA ??
            '5dddcb5fdfeb49f34f92e9d763a10da0105bd1a8',
        },
      },
})
