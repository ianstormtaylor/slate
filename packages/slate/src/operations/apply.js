import Debug from 'debug'

import Operation from '../models/operation'

/**
 * Debug.
 *
 * @type {Function}
 */

const debug = Debug('slate:operation:apply')

/**
 * Apply adjustments to affected ranges (selections, decorations);
 * accepts (value, checking function(range) -> bool, applying function(range) -> range)
 * returns value with affected ranges updated
 *
 * @param {Value} value
 * @param {Function} checkAffected
 * @param {Function} adjustRange
 * @return {Value}
 */

function applyRangeAdjustments(value, checkAffected, adjustRange) {
  // check selection, apply adjustment if affected
  if (value.selection && checkAffected(value.selection)) {
    value = value.set('selection', adjustRange(value.selection))
  }

  if (!value.decorations) return value

  // check all ranges, apply adjustment if affected
  const decorations = value.decorations
    .map(
      decoration =>
        checkAffected(decoration) ? adjustRange(decoration) : decoration
    )
    .filter(decoration => decoration.anchorKey !== null)
  return value.set('decorations', decorations)
}

/**
 * clear any atomic ranges (in decorations) if they contain the point (key, offset, offset-end?)
 * specified
 *
 * @param {Value} value
 * @param {String} key
 * @param {Number} offset
 * @param {Number?} offsetEnd
 * @return {Value}
 */

function clearAtomicRangesIfContains(value, key, offset, offsetEnd = null) {
  return applyRangeAdjustments(
    value,
    range => {
      if (!range.isAtomic) return false
      const { startKey, startOffset, endKey, endOffset } = range
      return (
        (startKey == key &&
          startOffset < offset &&
          (endKey != key || endOffset > offset)) ||
        (offsetEnd &&
          startKey == key &&
          startOffset < offsetEnd &&
          (endKey != key || endOffset > offsetEnd))
      )
    },
    range => range.deselect()
  )
}

/**
 * Applying functions.
 *
 * @type {Object}
 */

const APPLIERS = {
  /**
   * Add mark to text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  add_mark(value, operation) {
    const { path, offset, length, mark } = operation
    let { document } = value
    let node = document.assertPath(path)
    node = node.addMark(offset, length, mark)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Insert a `node` at `index` in a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  insert_node(value, operation) {
    const { path, node } = operation
    const index = path[path.length - 1]
    const rest = path.slice(0, -1)
    let { document } = value
    let parent = document.assertPath(rest)
    parent = parent.insertNode(index, node)
    document = document.updateNode(parent)
    value = value.set('document', document)
    return value
  },

  /**
   * Insert `text` at `offset` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  insert_text(value, operation) {
    const { path, offset, text, marks } = operation
    let { document } = value
    let node = document.assertPath(path)

    // Update the document
    node = node.insertText(offset, text, marks)
    document = document.updateNode(node)

    value = value.set('document', document)

    // if insert happens within atomic ranges, clear
    value = clearAtomicRangesIfContains(value, node.key, offset)

    // Update the selection, decorations
    value = applyRangeAdjustments(
      value,
      ({ anchorKey, anchorOffset, isBackward, isAtomic }) =>
        anchorKey == node.key &&
        (anchorOffset > offset ||
          (anchorOffset == offset && (!isAtomic || !isBackward))),
      range => range.moveAnchor(text.length)
    )

    value = applyRangeAdjustments(
      value,
      ({ focusKey, focusOffset, isBackward, isAtomic }) =>
        focusKey == node.key &&
        (focusOffset > offset ||
          (focusOffset == offset && (!isAtomic || isBackward))),
      range => range.moveFocus(text.length)
    )

    return value
  },

  /**
   * Merge a node at `path` with the previous node.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  merge_node(value, operation) {
    const { path } = operation
    const withPath = path
      .slice(0, path.length - 1)
      .concat([path[path.length - 1] - 1])
    let { document } = value
    const one = document.assertPath(withPath)
    const two = document.assertPath(path)
    let parent = document.getParent(one.key)
    const oneIndex = parent.nodes.indexOf(one)
    const twoIndex = parent.nodes.indexOf(two)

    // Perform the merge in the document.
    parent = parent.mergeNode(oneIndex, twoIndex)
    document = document.updateNode(parent)
    value = value.set('document', document)

    if (one.object == 'text') {
      value = applyRangeAdjustments(
        value,
        // If the nodes are text nodes and the range is inside the second node:
        ({ anchorKey, focusKey }) =>
          anchorKey == two.key || focusKey == two.key,
        // update it to refer to the first node instead:
        range => {
          if (range.anchorKey == two.key)
            range = range.moveAnchorTo(
              one.key,
              one.text.length + range.anchorOffset
            )
          if (range.focusKey == two.key)
            range = range.moveFocusTo(
              one.key,
              one.text.length + range.focusOffset
            )
          return range.normalize(document)
        }
      )
    }

    return value
  },

  /**
   * Move a node by `path` to `newPath`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  move_node(value, operation) {
    const { path, newPath } = operation
    const newIndex = newPath[newPath.length - 1]
    const newParentPath = newPath.slice(0, -1)
    const oldParentPath = path.slice(0, -1)
    const oldIndex = path[path.length - 1]
    let { document } = value
    const node = document.assertPath(path)

    // Remove the node from its current parent.
    let parent = document.getParent(node.key)
    parent = parent.removeNode(oldIndex)
    document = document.updateNode(parent)

    // Find the new target...
    let target

    // If the old path and the rest of the new path are the same, then the new
    // target is the old parent.
    if (
      oldParentPath.every((x, i) => x === newParentPath[i]) &&
      oldParentPath.length === newParentPath.length
    ) {
      target = parent
    } else if (
      oldParentPath.every((x, i) => x === newParentPath[i]) &&
      oldIndex < newParentPath[oldParentPath.length]
    ) {
      // Otherwise, if the old path removal resulted in the new path being no longer
      // correct, we need to decrement the new path at the old path's last index.
      newParentPath[oldParentPath.length]--
      target = document.assertPath(newParentPath)
    } else {
      // Otherwise, we can just grab the target normally...
      target = document.assertPath(newParentPath)
    }

    // Insert the new node to its new parent.
    target = target.insertNode(newIndex, node)
    document = document.updateNode(target)
    value = value.set('document', document)
    return value
  },

  /**
   * Remove mark from text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_mark(value, operation) {
    const { path, offset, length, mark } = operation
    let { document } = value
    let node = document.assertPath(path)
    node = node.removeMark(offset, length, mark)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Remove a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_node(value, operation) {
    const { path } = operation
    let { document, selection } = value
    const node = document.assertPath(path)

    if (selection.isSet || value.decorations !== null) {
      const first = node.object == 'text' ? node : node.getFirstText() || node
      const last = node.object == 'text' ? node : node.getLastText() || node
      const prev = document.getPreviousText(first.key)
      const next = document.getNextText(last.key)

      value = applyRangeAdjustments(
        value,
        // If the start or end point was in this node
        ({ startKey, endKey }) =>
          node.hasNode(startKey) || node.hasNode(endKey),
        // update it to be just before/after
        range => {
          const { startKey, endKey } = range

          if (node.hasNode(startKey)) {
            range = prev
              ? range.moveStartTo(prev.key, prev.text.length)
              : next ? range.moveStartTo(next.key, 0) : range.deselect()
          }

          if (node.hasNode(endKey)) {
            range = prev
              ? range.moveEndTo(prev.key, prev.text.length)
              : next ? range.moveEndTo(next.key, 0) : range.deselect()
          }

          // If the range wasn't deselected, normalize it.
          if (range.isSet) return range.normalize(document)
          return range
        }
      )
    }

    // Remove the node from the document.
    let parent = document.getParent(node.key)
    const index = parent.nodes.indexOf(node)
    parent = parent.removeNode(index)
    document = document.updateNode(parent)

    // Update the document and range.
    value = value.set('document', document)
    return value
  },

  /**
   * Remove `text` at `offset` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  remove_text(value, operation) {
    const { path, offset, text } = operation
    const { length } = text
    const rangeOffset = offset + length
    let { document } = value

    let node = document.assertPath(path)

    // if insert happens within atomic ranges, clear
    value = clearAtomicRangesIfContains(
      value,
      node.key,
      offset,
      offset + length
    )

    value = applyRangeAdjustments(
      value,
      // if anchor of range is here
      ({ anchorKey }) => anchorKey == node.key,
      // adjust if it is in or past the removal range
      range =>
        range.anchorOffset >= rangeOffset
          ? range.moveAnchor(-length)
          : range.anchorOffset > offset
            ? range.moveAnchorTo(range.anchorKey, offset)
            : range
    )

    value = applyRangeAdjustments(
      value,
      // if focus of range is here
      ({ focusKey }) => focusKey == node.key,
      // adjust if it is in or past the removal range
      range =>
        range.focusOffset >= rangeOffset
          ? range.moveFocus(-length)
          : range.focusOffset > offset
            ? range.moveFocusTo(range.focusKey, offset)
            : range
    )

    node = node.removeText(offset, length)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Set `properties` on mark on text at `offset` and `length` in node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_mark(value, operation) {
    const { path, offset, length, mark, properties } = operation
    let { document } = value
    let node = document.assertPath(path)
    node = node.updateMark(offset, length, mark, properties)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Set `properties` on a node by `path`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_node(value, operation) {
    const { path, properties } = operation
    let { document } = value
    let node = document.assertPath(path)
    node = node.merge(properties)
    document = document.updateNode(node)
    value = value.set('document', document)
    return value
  },

  /**
   * Set `properties` on the selection.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_selection(value, operation) {
    const { properties } = operation
    const { anchorPath, focusPath, ...props } = properties
    let { document, selection } = value

    if (anchorPath !== undefined) {
      props.anchorKey =
        anchorPath === null ? null : document.assertPath(anchorPath).key
    }

    if (focusPath !== undefined) {
      props.focusKey =
        focusPath === null ? null : document.assertPath(focusPath).key
    }

    selection = selection.merge(props)
    selection = selection.normalize(document)
    value = value.set('selection', selection)
    return value
  },

  /**
   * Set `properties` on `value`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  set_value(value, operation) {
    const { properties } = operation
    value = value.merge(properties)
    return value
  },

  /**
   * Split a node by `path` at `offset`.
   *
   * @param {Value} value
   * @param {Operation} operation
   * @return {Value}
   */

  split_node(value, operation) {
    const { path, position, properties } = operation
    let { document } = value

    // Calculate a few things...
    const node = document.assertPath(path)
    let parent = document.getParent(node.key)
    const index = parent.nodes.indexOf(node)

    // Split the node by its parent.
    parent = parent.splitNode(index, position)

    if (properties) {
      const splitNode = parent.nodes.get(index + 1)

      if (splitNode.object !== 'text') {
        parent = parent.updateNode(splitNode.merge(properties))
      }
    }

    document = document.updateNode(parent)
    const next = document.getNextText(node.key)

    value = applyRangeAdjustments(
      value,
      // check if range is affected
      ({ startKey, startOffset, endKey, endOffset }) =>
        (node.key == startKey && position <= startOffset) ||
        (node.key == endKey && position <= endOffset),
      // update its start / end as needed
      range => {
        const { startKey, startOffset, endKey, endOffset } = range
        let normalize = false

        if (node.key == startKey && position <= startOffset) {
          range = range.moveStartTo(next.key, startOffset - position)
          normalize = true
        }

        if (node.key == endKey && position <= endOffset) {
          range = range.moveEndTo(next.key, endOffset - position)
          normalize = true
        }

        // Normalize the selection if we changed it
        if (normalize) return range.normalize(document)
        return range
      }
    )

    // Return the updated value.
    value = value.set('document', document)
    return value
  },
}

/**
 * Apply an `operation` to a `value`.
 *
 * @param {Value} value
 * @param {Object|Operation} operation
 * @return {Value} value
 */

function applyOperation(value, operation) {
  operation = Operation.create(operation)
  const { type } = operation
  const apply = APPLIERS[type]

  if (!apply) {
    throw new Error(`Unknown operation type: "${type}".`)
  }

  debug(type, operation)
  value = apply(value, operation)
  return value
}

/**
 * Export.
 *
 * @type {Function}
 */

export default applyOperation
