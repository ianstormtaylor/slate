import Debug from 'debug'

import Operation from '../models/operation'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation:apply')

/**
 * Apply an `op` to a `value`.
 *
 * @param {Value} value
 * @param {Object|Operation} op
 * @return {Value} value
 */

function applyOperation(value, op) {
  op = Operation.create(op)
  const { type } = op
  debug(type, op)

  switch (type) {
    case 'add_annotation': {
      const { annotation } = op
      const next = value.addAnnotation(annotation)
      return next
    }

    case 'add_mark': {
      const { path, mark } = op
      const next = value.addMark(path, mark)
      return next
    }

    case 'insert_node': {
      const { path, node } = op
      const next = value.insertNode(path, node)
      return next
    }

    case 'insert_text': {
      const { path, offset, text, marks } = op
      const next = value.insertText(path, offset, text, marks)
      return next
    }

    case 'merge_node': {
      const { path } = op
      const next = value.mergeNode(path)
      return next
    }

    case 'move_node': {
      const { path, newPath } = op
      const next = value.moveNode(path, newPath)
      return next
    }

    case 'remove_annotation': {
      const { annotation } = op
      const next = value.removeAnnotation(annotation)
      return next
    }

    case 'remove_mark': {
      const { path, mark } = op
      const next = value.removeMark(path, mark)
      return next
    }

    case 'remove_node': {
      const { path } = op
      const next = value.removeNode(path)
      return next
    }

    case 'remove_text': {
      const { path, offset, text } = op
      const next = value.removeText(path, offset, text)
      return next
    }

    case 'set_annotation': {
      const { properties, newProperties } = op
      const next = value.setAnnotation(properties, newProperties)
      return next
    }

    case 'set_mark': {
      const { path, properties, newProperties } = op
      const next = value.setMark(path, properties, newProperties)
      return next
    }

    case 'set_node': {
      const { path, newProperties } = op
      const next = value.setNode(path, newProperties)
      return next
    }

    case 'set_selection': {
      const { newProperties } = op
      const next = value.setSelection(newProperties)
      return next
    }

    case 'set_value': {
      const { newProperties } = op
      const next = value.setProperties(newProperties)
      return next
    }

    case 'split_node': {
      const { path, position, properties } = op
      const next = value.splitNode(path, position, properties)
      return next
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

export default applyOperation
