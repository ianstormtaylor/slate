const defaultOptions = {
  minTime: 1000,
  maxTime: 2000,
  minTries: 100,
  maxTries: Infinity,
  allocationTries: 1000,
  async: false,
  mode: 'adaptive',
}

/**
 * Merge two options for configuring a bench run
 * @param {Object} options
 * @returns {Object}
 *   @property {number} minTime
 *   @property {number} maxTime
 *   @property {number} minTries
 *   @property {number} maxTries
 *   @property {number} allocationTries
 *   @property {boolean} async
 *   @property {"static"|"adaptive"} mode
 */

function makeOptions(options) {
  const result = { ...defaultOptions, ...options }

  for (const key in defaultOptions) {
    const shallType = typeof defaultOptions[key]
    const inputType = typeof result[key]

    if (shallType !== inputType) {
      throw TypeError(
        `Wrong Input in Config Suite, options[${key}] should be ${shallType}, but the input type is ${inputType}`
      )
    }
  }
  return result
}

module.exports = { makeOptions }
