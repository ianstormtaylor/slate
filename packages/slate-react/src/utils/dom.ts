/**
 * Types.
 */

// COMPAT: This is required to prevent TypeScript aliases from doing some very
// weird things for Slate's types with the same name as globals. (2019/11/27)
// https://github.com/microsoft/TypeScript/issues/35002
import DOMNode = globalThis.Node
import DOMComment = globalThis.Comment
import DOMElement = globalThis.Element
import DOMText = globalThis.Text
import DOMRange = globalThis.Range
import DOMSelection = globalThis.Selection
import DOMStaticRange = globalThis.StaticRange
import { ReactEditor } from '../plugin/react-editor'

export {
  DOMNode,
  DOMComment,
  DOMElement,
  DOMText,
  DOMRange,
  DOMSelection,
  DOMStaticRange,
}

declare global {
  interface Window {
    Selection: (typeof Selection)['constructor']
    DataTransfer: (typeof DataTransfer)['constructor']
    Node: (typeof Node)['constructor']
  }
}

export type DOMPoint = [Node, number]

/**
 * Returns the host window of a DOM node
 */

export const getDefaultView = (value: any): Window | null => {
  return (
    (value && value.ownerDocument && value.ownerDocument.defaultView) || null
  )
}

/**
 * Check if a DOM node is a comment node.
 */

export const isDOMComment = (value: any): value is DOMComment => {
  return isDOMNode(value) && value.nodeType === 8
}

/**
 * Check if a DOM node is an element node.
 */

export const isDOMElement = (value: any): value is DOMElement => {
  return isDOMNode(value) && value.nodeType === 1
}

/**
 * Check if a value is a DOM node.
 */

export const isDOMNode = (value: any): value is DOMNode => {
  const window = getDefaultView(value)
  return !!window && value instanceof window.Node
}

/**
 * Check if a value is a DOM selection.
 */

export const isDOMSelection = (value: any): value is DOMSelection => {
  const window = value && value.anchorNode && getDefaultView(value.anchorNode)
  return !!window && value instanceof window.Selection
}

/**
 * Check if a DOM node is an element node.
 */

export const isDOMText = (value: any): value is DOMText => {
  return isDOMNode(value) && value.nodeType === 3
}

/**
 * Checks whether a paste event is a plaintext-only event.
 */

export const isPlainTextOnlyPaste = (event: ClipboardEvent) => {
  return (
    event.clipboardData &&
    event.clipboardData.getData('text/plain') !== '' &&
    event.clipboardData.types.length === 1
  )
}

/**
 * Normalize a DOM point so that it always refers to a text node.
 */

export const normalizeDOMPoint = (domPoint: DOMPoint): DOMPoint => {
  let [node, offset] = domPoint

  // If it's an element node, its offset refers to the index of its children
  // including comment nodes, so try to find the right text child node.
  if (isDOMElement(node) && node.childNodes.length) {
    let isLast = offset === node.childNodes.length
    let index = isLast ? offset - 1 : offset
    ;[node, index] = getEditableChildAndIndex(
      node,
      index,
      isLast ? 'backward' : 'forward'
    )
    // If the editable child found is in front of input offset, we instead seek to its end
    isLast = index < offset

    // If the node has children, traverse until we have a leaf node. Leaf nodes
    // can be either text nodes, or other void DOM nodes.
    while (isDOMElement(node) && node.childNodes.length) {
      const i = isLast ? node.childNodes.length - 1 : 0
      node = getEditableChild(node, i, isLast ? 'backward' : 'forward')
    }

    // Determine the new offset inside the text node.
    offset = isLast && node.textContent != null ? node.textContent.length : 0
  }

  // Return the node and offset.
  return [node, offset]
}

/**
 * Determines whether the active element is nested within a shadowRoot
 */

export const hasShadowRoot = (node: Node | null) => {
  let parent = node && node.parentNode
  while (parent) {
    if (parent.toString() === '[object ShadowRoot]') {
      return true
    }
    parent = parent.parentNode
  }
  return false
}

/**
 * Get the nearest editable child and index at `index` in a `parent`, preferring
 * `direction`.
 */

export const getEditableChildAndIndex = (
  parent: DOMElement,
  index: number,
  direction: 'forward' | 'backward'
): [DOMNode, number] => {
  const { childNodes } = parent
  let child = childNodes[index]
  let i = index
  let triedForward = false
  let triedBackward = false

  // While the child is a comment node, or an element node with no children,
  // keep iterating to find a sibling non-void, non-comment node.
  while (
    isDOMComment(child) ||
    (isDOMElement(child) && child.childNodes.length === 0) ||
    (isDOMElement(child) && child.getAttribute('contenteditable') === 'false')
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
    index = i
    i += direction === 'forward' ? 1 : -1
  }

  return [child, index]
}

/**
 * Get the nearest editable child at `index` in a `parent`, preferring
 * `direction`.
 */

export const getEditableChild = (
  parent: DOMElement,
  index: number,
  direction: 'forward' | 'backward'
): DOMNode => {
  const [child] = getEditableChildAndIndex(parent, index, direction)
  return child
}

/**
 * Get a plaintext representation of the content of a node, accounting for block
 * elements which get a newline appended.
 *
 * The domNode must be attached to the DOM.
 */

export const getPlainText = (domNode: DOMNode) => {
  let text = ''

  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue
  }

  if (isDOMElement(domNode)) {
    for (const childNode of Array.from(domNode.childNodes)) {
      text += getPlainText(childNode)
    }

    const display = getComputedStyle(domNode).getPropertyValue('display')

    if (display === 'block' || display === 'list' || domNode.tagName === 'BR') {
      text += '\n'
    }
  }

  return text
}

/**
 * Get x-slate-fragment attribute from data-slate-fragment
 */
const catchSlateFragment = /data-slate-fragment="(.+?)"/m
export const getSlateFragmentAttribute = (
  dataTransfer: DataTransfer
): string | void => {
  const htmlData = dataTransfer.getData('text/html')
  const [, fragment] = htmlData.match(catchSlateFragment) || []
  return fragment
}

/**
 * Get the x-slate-fragment attribute that exist in text/html data
 * and append it to the DataTransfer object
 */
export const getClipboardData = (
  dataTransfer: DataTransfer,
  clipboardFormatKey = 'x-slate-fragment'
): DataTransfer => {
  if (!dataTransfer.getData(`application/${clipboardFormatKey}`)) {
    const fragment = getSlateFragmentAttribute(dataTransfer)
    if (fragment) {
      const clipboardData = new DataTransfer()
      dataTransfer.types.forEach(type => {
        clipboardData.setData(type, dataTransfer.getData(type))
      })
      clipboardData.setData(`application/${clipboardFormatKey}`, fragment)
      return clipboardData
    }
  }
  return dataTransfer
}

/**
 * Get the dom selection from Shadow Root if possible, otherwise from the document
 */
export const getSelection = (root: Document | ShadowRoot): Selection | null => {
  if (root.getSelection != null) {
    return root.getSelection()
  }
  return document.getSelection()
}

/**
 * Check whether a mutation originates from a editable element inside the editor.
 */

export const isTrackedMutation = (
  editor: ReactEditor,
  mutation: MutationRecord,
  batch: MutationRecord[]
): boolean => {
  const { target } = mutation
  if (isDOMElement(target) && target.matches('[contentEditable="false"]')) {
    return false
  }

  const { document } = ReactEditor.getWindow(editor)
  if (document.contains(target)) {
    return ReactEditor.hasDOMNode(editor, target, { editable: true })
  }

  const parentMutation = batch.find(({ addedNodes, removedNodes }) => {
    for (const node of addedNodes) {
      if (node === target || node.contains(target)) {
        return true
      }
    }

    for (const node of removedNodes) {
      if (node === target || node.contains(target)) {
        return true
      }
    }
  })

  if (!parentMutation || parentMutation === mutation) {
    return false
  }

  // Target add/remove is tracked. Track the mutation if we track the parent mutation.
  return isTrackedMutation(editor, parentMutation, batch)
}

/**
 * Retrieves the deepest active element in the DOM, considering nested shadow DOMs.
 */
export const getActiveElement = () => {
  let activeElement = document.activeElement

  while (activeElement?.shadowRoot && activeElement.shadowRoot?.activeElement) {
    activeElement = activeElement?.shadowRoot?.activeElement
  }

  return activeElement
}

/**
 * @returns `true` if `otherNode` is before `node` in the document; otherwise, `false`.
 */
export const isBefore = (node: DOMNode, otherNode: DOMNode): boolean =>
  Boolean(
    node.compareDocumentPosition(otherNode) &
      DOMNode.DOCUMENT_POSITION_PRECEDING
  )

/**
 * @returns `true` if `otherNode` is after `node` in the document; otherwise, `false`.
 */
export const isAfter = (node: DOMNode, otherNode: DOMNode): boolean =>
  Boolean(
    node.compareDocumentPosition(otherNode) &
      DOMNode.DOCUMENT_POSITION_FOLLOWING
  )
