/**
 * Dependencies.
 */

import { resetKeyGenerator } from '@gitbook/slate'

/**
 * Tests.
 */

describe('slate-react', () => {
  require('./plugins')
  require('./rendering')
  require('./utils')
})

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
