/**
 * Dependencies.
 */

import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('utils', () => {
  require('./order-child-decorations')
})

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
