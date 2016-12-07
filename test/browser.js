
import { resetKeyGenerator } from '..'

/**
 * Polyfills.
 */

import 'babel-polyfill'

/**
 * Tests.
 */

import './behavior'

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
