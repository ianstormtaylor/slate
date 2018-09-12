/**
 * Dependencies.
 */

import { resetKeyGenerator } from '@gitbook/slate'

/**
 * Tests.
 */

describe('utils', () => {
  require('./get-children-decorations')
})

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
