
let N = 0

/**
 * Create a unique identifier.
 *
 * @return {String} uid
 */

function uid() {
  return String(N++)
}

/**
 * Export.
 */

export default uid
