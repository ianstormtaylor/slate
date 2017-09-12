
import Before from './before'
import After from './after'

/**
 * A combined core plugin, which creates and return both the "before" and
 * "after" plugins.
 *
 * @param {Object} options
 * @return {Object}
 */

function CorePlugins(options = {}) {
  // Create a shared stateful object that the plugins can use share data.
  const tmp = {}

  // Initialize the plugins...
  const before = Before({ ...options, tmp })
  const after = After({ ...options, tmp })

  // Return both plugins.
  return { before, after }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CorePlugins
