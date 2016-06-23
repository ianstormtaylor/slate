
import assert from 'assert'
import type from 'component-type'

/**
 * Assertion error.
 */

const AssertionError = assert.AssertionError

/**
 * Assert that an `actual` JSON object equals an `expected` value.
 *
 * @param {Object} actual
 * @param {Object} expected
 * @throws {AssertionError}
 */

export function equal(actual, expected, message) {
  if (!test(actual, expected)) {
    throw new AssertionError({
      actual: actual,
      expected: wrap(actual, expected),
      operator: '==',
      stackStartFunction: equal
    })
  }
}

/**
 * Assert that an `actual` JSON object does not equal an `expected` value.
 *
 * @param {Object} actual
 * @param {Object} expected
 * @throws {AssertionError}
 */

export function notEqual(actual, expected, message) {
  if (test(actual, expected)) {
    throw new AssertionError({
      actual: actual,
      expected: wrap(actual, expected),
      operator: '!=',
      stackStartFunction: notEqual
    })
  }
}

/**
 * Assert that an `actual` JSON object strict equals an `expected` value.
 *
 * @param {Object} actual
 * @param {Object} expected
 * @throws {AssertionError}
 */

export function strictEqual(actual, expected, message) {
  if (!test(actual, expected, true)) {
    throw new AssertionError({
      actual: actual,
      expected: wrap(actual, expected),
      operator: '===',
      stackStartFunction: equal
    })
  }
}

/**
 * Assert that an `actual` JSON object does not strict equal an `expected` value.
 *
 * @param {Object} actual
 * @param {Object} expected
 * @throws {AssertionError}
 */

export function notStrictEqual(actual, expected, message) {
  if (test(actual, expected, true)) {
    throw new AssertionError({
      actual: actual,
      expected: wrap(actual, expected),
      operator: '!==',
      stackStartFunction: notEqual
    })
  }
}

/**
 * Test that an `actual` JSON value equals an `expected` JSON value.
 *
 * If a function is passed as any value, it is called with the actual value and
 * must return a boolean.
 *
 * Strict mode uses strict equality, forces arrays to be of the same length, and
 * objects to have the same keys.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {Boolean} strict
 * @return {Boolean}
 */

function test(actual, expected, strict) {
  if (type(expected) == 'function') return !! expected(actual)
  if (type(actual) != type(expected)) return false

  switch (type(expected)) {
    case 'object':
      return object(actual, expected, strict)
    case 'array':
      return array(actual, expected, strict)
    default:
      return strict ? actual === expected : actual == expected
  }
}

/**
 * Test that an `actual` object equals an `expected` object.
 *
 * @param {Object} object
 * @param {Object} expected
 * @param {Boolean} strict
 * @return {Boolean}
 */

function object(actual, expected, strict) {
  if (strict) {
    var ka = Object.keys(actual).sort()
    var ke = Object.keys(expected).sort()
    if (!test(ka, ke, strict)) return false
  }

  for (var key in expected) {
    if (!test(actual[key], expected[key], strict)) return false
  }

  return true
}

/**
 * Test that an `actual` array equals an `expected` array.
 *
 * @param {Array} actual
 * @param {Array} expected
 * @param {Boolean} strict
 * @return {Boolean}
 */

function array(actual, expected, strict) {
  if (strict) {
    if (!test(actual.length, expected.length, strict)) return false
  }

  for (var i = 0; i < expected.length; i++) {
    if (!test(actual[i], expected[i], strict)) return false
  }

  return true
}

/**
 * Wrap an expected value to remove annoying false negatives.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @return {Mixed}
 */

function wrap(actual, expected) {
  if (type(expected) == 'function') return expected(actual) ? actual : expected
  if (type(actual) != type(expected)) return expected

  if (type(expected) == 'object') {
    for (var key in expected) {
      expected[key] = wrap(actual[key], expected[key])
    }
  }

  if (type(expected) == 'array') {
    for (var i = 0; i < expected.length; i++) {
      expected[i] = wrap(actual[i], expected[i])
    }
  }

  return expected
}
