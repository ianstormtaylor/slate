import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-editor', () => {
  const input = {
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
    isInline() {},
    isVoid() {},
    normalizeNode() {},
    onChange() {},
    removeMark() {},
  }
  const test = value => {
    return Element.isElement(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
