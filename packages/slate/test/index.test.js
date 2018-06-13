/**
 * Dependencies.
 */

import { resetKeyGenerator } from '../src/'

/**
 * Tests.
 */

describe('slate', () => {
  /**
   * Reset Slate's internal key generator state before each text.
   */

  beforeEach(() => {
    resetKeyGenerator()
  })

  require('./serializers')
  require('./schema')
  require('./changes')
  require('./history')
  require('./operations')
  require('./models')
})
