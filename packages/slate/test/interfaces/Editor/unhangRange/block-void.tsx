/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block void>
      <text />
    </block>
  </editor>
)
export const test = editor => {
  const range = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [1, 0], offset: 0 },
  }
  return {
    voidsTrue: Editor.unhangRange(editor, range, { voids: true }),
    voidsFalse: Editor.unhangRange(editor, range),
  }
}
export const output = {
  voidsTrue: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [1, 0], offset: 0 },
  },
  voidsFalse: {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 3 },
  },
}
