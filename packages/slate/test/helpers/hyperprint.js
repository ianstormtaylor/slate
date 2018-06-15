import hyperprint from 'slate-hyperprint'

/**
 * Print a Slate `value`.
 *
 * @param {Object} value
 * @param {Object} options
 * @return {String}
 */

function print(value, options = {}) {
  return hyperprint(value, {
    strict: true,
    prettier: {
      singleQuote: false,
      tabWidth: 2,
    },
    ...options,
  })
}

/**
 * Export.
 *
 * @type {Function}
 */

export default print
