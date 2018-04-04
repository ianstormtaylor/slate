/**
 * Dependencies.
 */

import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('slate-react', () => {
  require('./plugins')
  require('./rendering')
})

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
