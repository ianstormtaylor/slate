/**
 * Dependencies.
 */

import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('slate-react', () => {
  beforeEach(resetKeyGenerator)

  require('./plugins')
  require('./rendering')
  require('./utils')
})
