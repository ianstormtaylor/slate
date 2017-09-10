
import { resetKeyGenerator } from '..'

/**
 * Polyfills.
 */

import 'babel-polyfill'

/**
 * Tests.
 */

import './serializers'
import './schemas'
import './changes'
import './history'

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
