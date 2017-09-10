
import { resetKeyGenerator } from '..'

/**
 * Polyfills.
 */

import 'babel-polyfill'

/**
 * Tests.
 */

import './plugins'
import './rendering'

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
