/**
 * Obtains the normalization setting to use for the change based on the
 * change object flags and the change operation options.
 *
 * @param {Object} flags - flags object for the current change object
 * @param {Object} options - options for the change operation
 * @return {bool} - the normalization configuration to use. Defaults to true
 *   if flags or options does not have a normalization configuration
 */

function getNormalizeSetting(flags, options) {
  let normalize = true
  if (flags.normalize !== undefined) {
    normalize = flags.normalize
  } else if (options.normalize !== undefined) {
    normalize = options.normalize
  }
  return normalize
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getNormalizeSetting
