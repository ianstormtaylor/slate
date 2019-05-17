import findPoint from './find-point'
import { Point, Range } from 'slate'

/**
 * setTextFromDomNode lets us take a domNode and reconcile the text in the
 * editor's Document such that it reflects the text in the DOM. This is the
 * opposite of what the Editor usually does which takes the Editor's Document
 * and React modifies the DOM to match. The purpose of this method is for
 * composition changes where we don't know what changes the user made by
 * looking at events. Instead we wait until the DOM is in a safe state, we
 * read from it, and update the Editor's Document.
 *
 * @param {Window} window
 * @param {Editor} editor
 * @param {Node} domNode
 */

export default function setTextFromDomNode(window, editor, domNode) {
  const { value } = editor
  const { document, selection } = value
  const domElement = domNode.parentElement.closest('[data-key]')
  const point = editor.findPoint(domElement, 0)
  const node = document.getDescendant(point.path)
  const block = document.getClosestBlock(point.path)

  // Get text information
  const { text } = node
  let { textContent: domText } = domElement

  const isLastNode = block.nodes.last() === node
  const lastChar = domText.charAt(domText.length - 1)

  // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
  // we will have added another new line in <Leaf>'s render method to account
  // for browsers collapsing a single trailing new lines, so remove it.
  if (isLastNode && lastChar === '\n') {
    domText = domText.slice(0, -1)
  }

  // If the text is no different, abort.
  if (text === domText) return

  let entire = selection
    .moveAnchorTo(point.path, 0)
    .moveFocusTo(point.path, text.length)

  entire = document.resolveRange(entire)

  // Change the current value to have the leaf's text replaced.
  editor.insertTextAtRange(entire, domText, node.marks)
  return
}
