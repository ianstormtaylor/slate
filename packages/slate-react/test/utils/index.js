/**
 * Dependencies.
 */

import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('utils', () => {
  beforeEach(resetKeyGenerator)
  require('./get-children-decorations')
})
