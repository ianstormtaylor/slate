/**
 * If the node is a void node, copy it using `ClipboardEvent.clipboardData`.
 *
 * This is needed because Chrome doesn't copy the whole HTML markup we generate
 * in `cloneFragment`, so the encoded Slate fragment will be not included.
 *
 * @param {Event} event
 * @param {Value} value
 */

function copyVoidNode(event, value) {
  const { endBlock, endInline } = value
  const isVoidBlock = endBlock && endBlock.isVoid
  const isVoidInline = endInline && endInline.isVoid
  const isVoid = isVoidBlock || isVoidInline

  if (isVoid) {
    const range = window.getSelection().getRangeAt(0)
    const contents = range.cloneContents()
    const attach = contents.childNodes[0]
    const clipboardData = event.nativeEvent.clipboardData

    if (clipboardData && clipboardData.setData) {
      clipboardData.setData('text/html', attach.innerHTML)
      event.preventDefault()
      return
    }
  }
}

export default copyVoidNode
