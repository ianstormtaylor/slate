/* eslint-disable import/no-extraneous-dependencies */
/**
 * Dependencies.
 */

import { KeyUtils } from 'slate'

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

beforeEach(KeyUtils.resetGenerator)
