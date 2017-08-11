
import Debug from 'debug'
import pick from 'lodash/pick'

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
  const { type } = op
  debug(type, op)

  /**
   * Insert node.
   */

  if (type == 'insert_node') {
    return {
      ...op,
      type: 'remove_node',
    }
  }

  /**
   * Remove node.
   */

  if (type == 'remove_node') {
    return {
      ...op,
      type: 'insert_node',
    }
  }

  /**
   * Move node.
   */

  if (type == 'move_node') {
    return {
      ...op,
      path: op.newPath,
      newPath: op.path,
    }
  }

  /**
   * Merge node.
   */

  if (type == 'merge_node') {
    const { path } = op
    const { length } = path
    const last = length - 1
    return {
      ...op,
      type: 'split_node',
      path: path.slice(0, last).concat([path[last] - 1]),
    }
  }

  /**
   * Split node.
   */

  if (type == 'split_node') {
    const { path } = op
    const { length } = path
    const last = length - 1
    return {
      ...op,
      type: 'merge_node',
      path: path.slice(0, last).concat([path[last] + 1]),
    }
  }

  /**
   * Set node.
   */

  if (type == 'set_node') {
    const { properties, node } = op
    return {
      ...op,
      node: node.merge(properties),
      properties: pick(node, Object.keys(properties)),
    }
  }

  /**
   * Insert text.
   */

  if (type == 'insert_text') {
    return {
      ...op,
      type: 'remove_text',
    }
  }

  /**
   * Remove text.
   */

  if (type == 'remove_text') {
    return {
      ...op,
      type: 'insert_text',
    }
  }

  /**
   * Add mark.
   */

  if (type == 'add_mark') {
    return {
      ...op,
      type: 'remove_mark',
    }
  }

  /**
   * Remove mark.
   */

  if (type == 'remove_mark') {
    return {
      ...op,
      type: 'add_mark',
    }
  }

  /**
   * Set mark.
   */

  if (type == 'set_mark') {
    const { properties, mark } = op
    return {
      ...op,
      mark: mark.merge(properties),
      properties: pick(mark, Object.keys(properties)),
    }
  }

  /**
   * Set selection.
   */

  if (type == 'set_selection') {
    const { properties, selection } = op
    const inverse = {
      ...op,
      selection: { ...selection, ...properties },
      properties: pick(selection, Object.keys(properties)),
    }

    return inverse
  }

  /**
   * Set data.
   */

  if (type == 'set_data') {
    const { properties, data } = op
    return {
      ...op,
      data: data.merge(properties),
      properties: pick(data, Object.keys(properties)),
    }
  }

  /**
   * Unknown.
   */

  throw new Error(`Unknown op type: "${type}".`)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default invertOperation
