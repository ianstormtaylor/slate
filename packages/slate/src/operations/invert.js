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

      const pathLast = path.size - 1
      const newPathLast = newPath.size - 1

      // If the node's old position was a left sibling of an ancestor of
      // its new position, we need to adjust part of the path by -1.
      if (
        path.size < inversePath.size &&
        path.slice(0, pathLast).every((e, i) => e == inversePath.get(i)) &&
        path.last() < inversePath.get(pathLast)
      ) {
        inversePath = inversePath
          .slice(0, pathLast)
          .concat(inversePath.get(pathLast) - 1)
          .concat(inversePath.slice(pathLast + 1, inversePath.size))
      }

      // If the node's new position is an ancestor of the old position,
      // or a left sibling of an ancestor of its old position, we need
      // to adjust part of the path by 1.
      if (
        newPath.size < inverseNewPath.size &&
        newPath
          .slice(0, newPathLast)
          .every((e, i) => e == inverseNewPath.get(i)) &&
        newPath.last() <= inverseNewPath.get(newPathLast)
      ) {
        inverseNewPath = inverseNewPath
          .slice(0, newPathLast)
          .concat(inverseNewPath.get(newPathLast) + 1)
          .concat(inverseNewPath.slice(newPathLast + 1, inverseNewPath.size))
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
