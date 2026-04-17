export const withTest = (editor) => {
  const { isInline, isVoid, isElementReadOnly, isSelectable } = editor

  editor.isInline = (element) => {
    return element.inline === true ? true : isInline(element)
  }
  editor.isVoid = (element) => {
    return element.void === true ? true : isVoid(element)
  }
  editor.isElementReadOnly = (element) => {
    return element.readOnly === true ? true : isElementReadOnly(element)
  }
  editor.isSelectable = (element) => {
    return element.nonSelectable === true ? false : isSelectable(element)
  }

  return editor
}
