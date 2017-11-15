
import Debug from 'debug'
import pick from 'lodash/pick'

import Operation from '../models/operation'

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

  /**
   * Insert node.
   */

  if (type == 'insert_node') {
    const inverse = op.set('type', 'remove_node')
    return inverse
  }

  /**
   * Remove node.
   */

  if (type == 'remove_node') {
    const inverse = op.set('type', 'insert_node')
    return inverse
  }

  /**
   * Move node.
   */

  if (type == 'move_node') {
    const { newPath, path } = op
    const inverse = op.set('path', newPath).set('newPath', path)
    return inverse
  }

  /**
   * Merge node.
   */

  if (type == 'merge_node') {
    const { path } = op
    const { length } = path
    const last = length - 1
    const inversePath = path.slice(0, last).concat([path[last] - 1])
    const inverse = op.set('type', 'split_node').set('path', inversePath)
    return inverse
  }

  /**
   * Split node.
   */

  if (type == 'split_node') {
    const { path } = op
    const { length } = path
    const last = length - 1
    const inversePath = path.slice(0, last).concat([path[last] + 1])
    const inverse = op.set('type', 'merge_node').set('path', inversePath)
    return inverse
  }

  /**
   * Set node.
   */

  if (type == 'set_node') {
    const { properties, node } = op
    const inverseNode = node.merge(properties)
    const inverseProperties = pick(node, Object.keys(properties))
    const inverse = op.set('node', inverseNode).set('properties', inverseProperties)
    return inverse
  }

  /**
   * Insert text.
   */

  if (type == 'insert_text') {
    const inverse = op.set('type', 'remove_text')
    return inverse
  }

  /**
   * Remove text.
   */

  if (type == 'remove_text') {
    const inverse = op.set('type', 'insert_text')
    return inverse
  }

  /**
   * Add mark.
   */

  if (type == 'add_mark') {
    const inverse = op.set('type', 'remove_mark')
    return inverse
  }

  /**
   * Remove mark.
   */

  if (type == 'remove_mark') {
    const inverse = op.set('type', 'add_mark')
    return inverse
  }

  /**
   * Set mark.
   */

  if (type == 'set_mark') {
    const { properties, mark } = op
    const inverseMark = mark.merge(properties)
    const inverseProperties = pick(mark, Object.keys(properties))
    const inverse = op.set('mark', inverseMark).set('properties', inverseProperties)
    return inverse
  }

  /**
   * Set selection.
   */

  if (type == 'set_selection') {
    const { properties, selection, value } = op
    const { anchorPath, focusPath, ...props } = properties
    const { document } = value

    if (anchorPath !== undefined) {
      props.anchorKey = anchorPath === null
        ? null
        : document.assertPath(anchorPath).key
    }

    if (focusPath !== undefined) {
      props.focusKey = focusPath === null
        ? null
        : document.assertPath(focusPath).key
    }

    const inverseSelection = selection.merge(props)
    const inverseProps = pick(selection, Object.keys(props))

    if (anchorPath !== undefined) {
      inverseProps.anchorPath = inverseProps.anchorKey === null
        ? null
        : document.getPath(inverseProps.anchorKey)
      delete inverseProps.anchorKey
    }

    if (focusPath !== undefined) {
      inverseProps.focusPath = inverseProps.focusKey === null
        ? null
        : document.getPath(inverseProps.focusKey)
      delete inverseProps.focusKey
    }

    const inverse = op.set('selection', inverseSelection).set('properties', inverseProps)
    return inverse
  }

  /**
   * Set value.
   */

  if (type == 'set_value') {
    const { properties, value } = op
    const inverseValue = value.merge(properties)
    const inverseProperties = pick(value, Object.keys(properties))
    const inverse = op.set('value', inverseValue).set('properties', inverseProperties)
    return inverse
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default invertOperation
