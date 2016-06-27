
import generate from 'uid'

/**
 * Create a unique identifier.
 *
 * @return {String} uid
 */

function uid() {
  return generate(4)
}

/**
 * Export.
 */

export default uid
