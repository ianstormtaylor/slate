import Debug from 'debug'
import pick from 'lodash/pick'

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

      let inversePath = newPath
      let inverseNewPath = path

      const position = PathUtils.compare(path, newPath)

      // If the node's old position was a left sibling of an ancestor of
      // its new position, we need to adjust part of the path by -1.
      // If the node's new position is an ancestor of the old position,
      // or a left sibling of an ancestor of its old position, we need
      // to adjust part of the path by 1.
      if (path.size < newPath.size && position === -1) {
        inversePath = PathUtils.decrement(newPath, 1, path.size - 1)
      } else if (path.size > newPath.size && position !== -1) {
        inverseNewPath = PathUtils.increment(path, 1, newPath.size - 1)
      }

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

    case 'set_node': {
      const { properties, node } = op
      const inverseNode = node.merge(properties)
      const inverseProperties = pick(node, Object.keys(properties))
      const inverse = op
        .set('node', inverseNode)
        .set('properties', inverseProperties)
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

    case 'set_mark': {
      const { properties, mark } = op
      const inverseMark = mark.merge(properties)
      const inverseProperties = pick(mark, Object.keys(properties))
      const inverse = op
        .set('mark', inverseMark)
        .set('properties', inverseProperties)
      return inverse
    }

    case 'set_selection': {
      const { properties, selection } = op
      const inverseSelection = selection.merge(properties)
      const inverseProps = pick(selection, Object.keys(properties))
      const inverse = op
        .set('selection', inverseSelection)
        .set('properties', inverseProps)
      return inverse
    }

    case 'set_value': {
      const { properties, value } = op
      const inverseValue = value.merge(properties)
      const inverseProperties = pick(value, Object.keys(properties))
      const inverse = op
        .set('value', inverseValue)
        .set('properties', inverseProperties)
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
