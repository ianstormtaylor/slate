
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
  require('./schemas')
  require('./changes')
  require('./history')
})

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
