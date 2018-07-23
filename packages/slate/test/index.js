/**
 * Dependencies.
 */
/* eslint-disable import/no-extraneous-dependencies */
import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('slate', () => {
  beforeEach(resetKeyGenerator)

  require('./serializers')
  require('./schema')
  require('./changes')
  require('./history')
  require('./operations')
  require('./models')
})
