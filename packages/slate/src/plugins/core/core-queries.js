import * as Format from '../../queries/format'
import * as Node from '../../queries/node'
import * as Path from '../../queries/path'
import * as Point from '../../queries/point'
import * as Range from '../../queries/range'

/**
 * A plugin that defines the core Slate queries.
 *
 * @return {Object}
 */

function CoreQueriesPlugin() {
  return {
    ...Format,
    ...Node,
    ...Path,
    ...Point,
    ...Range,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default CoreQueriesPlugin
