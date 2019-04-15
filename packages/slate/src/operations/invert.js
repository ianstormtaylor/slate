import Debug from 'debug'

import Operation from '../models/operation'
import PathUtils from '../utils/path-utils'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation:invert')

/**
 * Invert an `op`.
 *
 * @param {Object} op
 * @return {Object}
 */

function invertOperation(op) {
  op = Operation.create(op)
  const { type } = op
  debug(type, op)

  switch (type) {
    case 'insert_node': {
      const inverse = op.set('type', 'remove_node')
      return inverse
    }

    case 'remove_node': {
      const inverse = op.set('type', 'insert_node')
      return inverse
    }

    case 'move_node': {
      const { newPath, path } = op

      if (PathUtils.isEqual(newPath, path)) {
        return op
      }

      // Get the true path that the moved node ended up at
      const inversePath = PathUtils.transform(path, op).first()

      // Get the true path we are trying to move back to
      // We transform the right-sibling of the path
      // This will end up at the operation.path most of the time
      // But if the newPath is a left-sibling or left-ancestor-sibling, this will account for it
      const transformedSibling = PathUtils.transform(
        PathUtils.increment(path),
        op
      ).first()

      const inverse = op
        .set('path', inversePath)
        .set('newPath', transformedSibling)
      return inverse
    }

    case 'merge_node': {
      const { path } = op
      const inversePath = PathUtils.decrement(path)
      const inverse = op.set('type', 'split_node').set('path', inversePath)
      return inverse
    }

    case 'split_node': {
      const { path } = op
      const inversePath = PathUtils.increment(path)
      const inverse = op.set('type', 'merge_node').set('path', inversePath)
      return inverse
    }

    case 'set_node':
    case 'set_value':
    case 'set_selection':
    case 'set_mark': {
      const { properties, newProperties } = op
      const inverse = op
        .set('properties', newProperties)
        .set('newProperties', properties)
      return inverse
    }

    case 'insert_text': {
      const inverse = op.set('type', 'remove_text')
      return inverse
    }

    case 'remove_text': {
      const inverse = op.set('type', 'insert_text')
      return inverse
    }

    case 'add_mark': {
      const inverse = op.set('type', 'remove_mark')
      return inverse
    }

    case 'remove_mark': {
      const inverse = op.set('type', 'add_mark')
      return inverse
    }

    default: {
      throw new Error(`Unknown operation type: "${type}".`)
    }
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default invertOperation
