import findPoint from './find-point'

export default function setTextFromDomNode(window, editor, domNode) {
  const point = findPoint(domNode, 0, editor)
  if (!point) return

  // Get the text node and leaf in question.
  const { value } = editor
  const { document, selection } = value
  const node = document.getDescendant(point.key)
  const block = document.getClosestBlock(node.key)
  const leaves = node.getLeaves()
  const lastText = block.getLastText()
  const lastLeaf = leaves.last()
  let start = 0
  let end = 0

  const leaf =
    leaves.find(r => {
      start = end
      end += r.text.length
      if (end > point.offset) return true
    }) || lastLeaf

  // Get the text information.
  const { text } = leaf
  let { textContent } = domNode
  const isLastText = node == lastText
  const isLastLeaf = leaf == lastLeaf
  const lastChar = textContent.charAt(textContent.length - 1)

  // COMPAT: If this is the last leaf, and the DOM text ends in a new line,
  // we will have added another new line in <Leaf>'s render method to account
  // for browsers collapsing a single trailing new lines, so remove it.
  if (isLastText && isLastLeaf && lastChar == '\n') {
    textContent = textContent.slice(0, -1)
  }

  // If the text is no different, abort.
  if (textContent == text) return

  // Determine what the selection should be after changing the text.
  // const delta = textContent.length - text.length
  // const corrected = selection.moveToEnd().moveForward(delta)
  let entire = selection
    .moveAnchorTo(point.key, start)
    .moveFocusTo(point.key, end)

  entire = document.resolveRange(entire)

  // Change the current value to have the leaf's text replaced.
  editor.insertTextAtRange(entire, textContent, leaf.marks)
}
