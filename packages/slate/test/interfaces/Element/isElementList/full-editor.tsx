import { Element } from 'slate'

export const input = [
  {
    children: [],
    operations: [],
    selection: null,
    marks: null,
    addMark() {},
    apply() {},
    deleteBackward() {},
    deleteForward() {},
    deleteFragment() {},
    insertBreak() {},
    insertSoftBreak() {},
    insertFragment() {},
    insertNode() {},
    insertText() {},
    isElementReadOnly() {},
    isInline() {},
    isSelectable() {},
    isVoid() {},
    normalizeNode() {},
    onChange() {},
    removeMark() {},
    getDirtyPaths() {},
  },
]
export const test = value => {
  return Element.isElementList(value)
}
export const output = false
