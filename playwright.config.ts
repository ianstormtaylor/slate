import { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import * as os from 'os'

const projects = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      permissions: ['clipboard-read', 'clipboard-write'],
      launchOptions: {
        // headless: false,
        /**
         * Enable scrollbars in headless mode.
         */
        ignoreDefaultArgs: ['--hide-scrollbars'],
      },
    },
  },
  {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
    },
  },
]

if (os.type() === 'Darwin') {
  projects.push({
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
    },
  })
}

const retries = process.env.PLAYWRIGHT_RETRIES
  ? +process.env.PLAYWRIGHT_RETRIES
  : process.env.CI
  ? 5
  : 2

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './playwright',
  /* Maximum time one test can run for. */
  timeout: 20 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 8000,
  },
  /* Run tests in files in parallel */
  fullyParallel: !process.env.CI,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // allow PLAYWRIGHT_RETRIES to override for local dev
  retries,
  /* Opt out of parallel tests. */
  // workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    viewport: {
      width: 1280,
      height: 720,
    },
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Name of attribute for selecting elements by page.getByTestId */
    testIdAttribute: 'data-test-id',
  },

  /* Configure projects for major browsers */
  projects,

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',
}

export default config
