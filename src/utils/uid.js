
import generate from 'uid'

/**
 * Create a unique identifier.
 *
 * @return {String} uid
 */

function uid() {
  return generate(10)
}

/**
 * Export.
 */

export default uid
