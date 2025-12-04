import type { PlaywrightTestConfig } from '@playwright/test'
import baseConfig from '../../playwright.config'

const config: PlaywrightTestConfig = {
  ...baseConfig,
  testDir: '..',
  outputDir: '../../test-results/docker',
}

export default config
