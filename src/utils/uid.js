
import generate from 'uid'

let N = 0

/**
 * Create a unique identifier.
 *
 * @return {String} uid
 */

function uid() {
  return (N++) + generate(4)
}

/**
 * Export.
 */

export default uid
