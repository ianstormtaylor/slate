import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import os from 'os';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const projects = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        // headless: false,
        /**
         * Enable scrollbars in headless mode.
         * This is needed to successfully write a test for this issue:
         * https://github.com/vercel/next-live-mode/issues/1259
         * We should manually crop out the scrollbar when/if we want to take
         * a screenshot of the whole page for visual diffing.
         */
        ignoreDefaultArgs: ['--hide-scrollbars'],
      },
    },
  },
  // {
  //   name: 'firefox',
  //   use: {
  //     ...devices['Desktop Firefox'],
  //   },
  // },
];

// if (os.type() === 'Darwin') {
//   projects.push({
//     name: 'webkit',
//     use: {
//       ...devices['Desktop Safari'],
//     },
//   });
// }

const retries = process.env.LIVE_PLAYWRIGHT_RETRIES
  ? +process.env.LIVE_PLAYWRIGHT_RETRIES
  : process.env.CI
  ? 5
  : 0;

if (retries) {
  console.log(`Running tests with retries: ${retries}`);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './playwright',
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
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
  // allow LIVE_PLAYWRIGHT_RETRIES to override for local dev
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
  },

  /* Configure projects for major browsers */
  projects,

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /*webServer: {
    command: 'cd ../../ && pnpm run dev',
    url: 'http://localhost:9999',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },*/
};

export default config;