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
    case 'move_node': {
      const { newPath, path } = op

      // PERF: this case can exit early.
      if (PathUtils.isEqual(newPath, path)) {
        return op
      }

      const inversePath = PathUtils.transform(path, op).first()

      // Get the true path we are trying to move back to
      // We transform the right-sibling of the path
      // This will end up at the operation.path most of the time
      // But if the newPath is a left-sibling or left-ancestor-sibling, this will account for it
      const inverseNewPath = PathUtils.transform(
        PathUtils.increment(path),
        op
      ).first()

      const inverse = op.set('path', inversePath).set('newPath', inverseNewPath)
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

    case 'set_annotation':
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

    case 'insert_node':
    case 'insert_text': {
      const inverse = op.set('type', type.replace('insert_', 'remove_'))
      return inverse
    }

    case 'remove_node':
    case 'remove_text': {
      const inverse = op.set('type', type.replace('remove_', 'insert_'))
      return inverse
    }

    case 'add_annotation':
    case 'add_mark': {
      const inverse = op.set('type', type.replace('add_', 'remove_'))
      return inverse
    }

    case 'remove_annotation':
    case 'remove_mark': {
      const inverse = op.set('type', type.replace('remove_', 'add_'))
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
