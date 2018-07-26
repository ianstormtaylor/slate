/**
 * Dependencies.
 */

import { KeyUtils } from '..'

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
})

/**
 * Reset Slate's internal key generator state before each text.
 */

beforeEach(() => {
  KeyUtils.resetGenerator()
})
