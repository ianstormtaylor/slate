/**
 * Dependencies.
 */

import { resetKeyGenerator } from '..'

/**
 * Tests.
 */

describe('slate', () => {
  require('./serializers')
  require('./schema')
  require('./changes')
  require('./history')
  require('./operations')
  require('./models')
  require('./utils')
})

/**
 * Reset Slate's internal key generator state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
