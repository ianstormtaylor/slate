
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
import './plugins'
import './rendering'
import './changes'

/**
 * Reset Slate's internal state before each text.
 */

beforeEach(() => {
  resetKeyGenerator()
})
