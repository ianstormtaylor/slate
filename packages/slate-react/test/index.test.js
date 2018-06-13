/**
 * Dependencies.
 */

import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('slate-react', () => {
  /**
   * Reset Slate's internal state before each text.
   */

  beforeEach(() => {
    resetKeyGenerator()
  })

  require('./plugins')
  require('./rendering')
  require('./utils')
})
