import assert from 'assert'
import print from './hyperprint'

/**
 * Assert that an `actual` Slate value equals an `expected`.
 *
 * @param {Value} actual
 * @param {Value} expected
 * @param {Object} options
 */

function assertValuesEqual(actual, expected, options) {
  try {
    assert.deepEqual(actual.toJSON(), expected.toJSON())
  } catch (e) {
    e.actual = print(actual, options)
    e.expected = print(expected, options)
    throw e
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default assertValuesEqual
