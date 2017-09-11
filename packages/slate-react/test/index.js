
/**
 * Polyfills.
 */

import 'babel-polyfill' // eslint-disable-line import/no-extraneous-dependencies

/**
 * Dependencies.
 */

import { resetKeyGenerator } from 'slate'

/**
 * Tests.
 */

describe('slate-react', () => {
  require('./plugins')
  require('./rendering')
})

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
