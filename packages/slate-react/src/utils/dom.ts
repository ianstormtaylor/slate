import { IS_IE } from './environment'

/**
 * Types.
 */

export type NativeComment = Comment
export type NativeElement = Element
export type NativeText = Text
export type NativeNode = Node
export type NativePoint = { node: NativeNode; offset: number }
export type NativeRange = Range
export type NativeSelection = Selection
export type NativeStaticRange = StaticRange

/**
 * Check if a DOM node is a comment node.
 */

export const isNativeComment = (value: any): value is NativeComment => {
  return isNativeNode(value) && value.nodeType === 8
}

/**
 * Check if a DOM node is an element node.
 */

export const isNativeElement = (value: any): value is NativeElement => {
  return isNativeNode(value) && value.nodeType === 1
}

/**
 * Check if a value is a DOM node.
 */

export const isNativeNode = (value: any): value is NativeNode => {
  return value instanceof Node
}

/**
 * Check if a DOM node is an element node.
 */

export const isNativeText = (value: any): value is NativeText => {
  return isNativeNode(value) && value.nodeType === 3
}

/**
 * From a DOM selection's `node` and `offset`, normalize so that it always
 * refers to a text node.
 */

export const normalizeNodeAndOffset = (domPoint: NativePoint) => {
  let { node, offset } = domPoint

  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (isNativeElement(node) && node.childNodes.length) {
    const isLast = offset === node.childNodes.length
    const direction = isLast ? 'backward' : 'forward'
    const index = isLast ? offset - 1 : offset
    node = getEditableChild(node, index, direction)

    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (isNativeElement(node) && node.childNodes.length) {
      const i = isLast ? node.childNodes.length - 1 : 0
      node = getEditableChild(node, i, direction)
    }

    // Determine the new offset inside the text node.
    offset = isLast && node.textContent != null ? node.textContent.length : 0
  }

  // Return the node and offset.
  return { node, offset }
}

/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 */

export const getEditableChild = (
  parent: NativeElement,
  index: number,
  direction: 'forward' | 'backward'
): NativeNode => {
  const { childNodes } = parent
  let child = childNodes[index]
  let i = index
  let triedForward = false
  let triedBackward = false

  // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.
  while (
    isNativeComment(child) ||
    (isNativeElement(child) && child.childNodes.length === 0) ||
    (isNativeElement(child) &&
      child.getAttribute('contenteditable') === 'false')
  ) {
    if (triedForward && triedBackward) {
      break
    }

    if (i >= childNodes.length) {
      triedForward = true
      i = index - 1
      direction = 'backward'
      continue
    }

    if (i < 0) {
      triedBackward = true
      i = index + 1
      direction = 'forward'
      continue
    }

    child = childNodes[i]
    i += direction === 'forward' ? 1 : -1
  }

  return child
}

/**
 * Cross-browser remove all ranges from a `domSelection`.
 */

export const removeAllRanges = (domSelection: NativeSelection) => {
  // COMPAT: In IE 11, if the selection contains nested tables, then
  // `removeAllRanges` will throw an error.
  if (IS_IE) {
    const range = (window.document.body as any).createTextRange()
    range.collapse()
    range.select()
  } else {
    domSelection.removeAllRanges()
  }
}
