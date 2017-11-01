
/**
 * Polyfills.
 */

import 'babel-polyfill' // eslint-disable-line import/no-extraneous-dependencies

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
})

/**
 * Reset Slate's internal key generator state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
