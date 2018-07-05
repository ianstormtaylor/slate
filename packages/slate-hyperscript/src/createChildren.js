import { Node, Text } from 'slate'
import { ANCHOR, FOCUS, CURSOR } from './constants/selection'
import DecoratorPoint from './decorator-point'

/**
 * Create an array of `children`, storing selection anchor and focus.
 *
 * @param {Array} children
 * @param {Object} options
 * @return {Array}
 */

function createChildren(children, options = {}) {
  const array = []
  let length = 0

  // When creating the new node, try to preserve a key if one exists.
  const firstNodeOrText = children.find(c => typeof c !== 'string')
  const firstText = Text.isText(firstNodeOrText) ? firstNodeOrText : null
  const key = options.key ? options.key : firstText ? firstText.key : undefined
  let node = Text.create({ key, leaves: [{ text: '', marks: options.marks }] })

  // Create a helper to update the current node while preserving any stored
  // anchor or focus information.
  function setNode(next) {
    const { __anchor, __focus, __decorations } = node
    if (__anchor != null) next.__anchor = __anchor
    if (__focus != null) next.__focus = __focus
    if (__decorations != null) next.__decorations = __decorations
    node = next
  }

  children.forEach((child, index) => {
    const isLast = index === children.length - 1

    // If the child is a non-text node, push the current node and the new child
    // onto the array, then creating a new node for future selection tracking.
    if (Node.isNode(child) && !Text.isText(child)) {
      if (
        node.text.length ||
        node.__anchor != null ||
        node.__focus != null ||
        node.getMarksAtIndex(0).size
      ) {
        array.push(node)
      }

      array.push(child)

      node = isLast
        ? null
        : Text.create({ leaves: [{ text: '', marks: options.marks }] })

      length = 0
    }

    // If the child is a string insert it into the node.
    if (typeof child == 'string') {
      setNode(node.insertText(node.text.length, child, options.marks))
      length += child.length
    }

    // If the node is a `Text` add its text and marks to the existing node. If
    // the existing node is empty, and the `key` option wasn't set, preserve the
    // child's key when updating the node.
    if (Text.isText(child)) {
      const { __anchor, __focus, __decorations } = child
      let i = node.text.length

      if (!options.key && node.text.length == 0) {
        setNode(node.set('key', child.key))
      }

      child.getLeaves().forEach(leaf => {
        let { marks } = leaf
        if (options.marks) marks = marks.union(options.marks)
        setNode(node.insertText(i, leaf.text, marks))
        i += leaf.text.length
      })

      if (__anchor != null) node.__anchor = __anchor + length
      if (__focus != null) node.__focus = __focus + length

      if (__decorations != null) {
        node.__decorations = (node.__decorations || []).concat(
          __decorations.map(
            d =>
              d instanceof DecoratorPoint
                ? d.addOffset(length)
                : {
                    ...d,
                    anchorOffset: d.anchorOffset + length,
                    focusOffset: d.focusOffset + length,
                  }
          )
        )
      }

      length += child.text.length
    }

    // If the child is a selection object store the current position.
    if (child == ANCHOR || child == CURSOR) node.__anchor = length
    if (child == FOCUS || child == CURSOR) node.__focus = length

    // if child is a decorator point, store it as partial decorator
    if (child instanceof DecoratorPoint) {
      node.__decorations = (node.__decorations || []).concat([
        child.withPosition(length),
      ])
    }
  })

  // Make sure the most recent node is added.
  if (node != null) {
    array.push(node)
  }

  return array
}

export default createChildren
