/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>one</text>
      <inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
export const test = editor => {
  return Editor.unhangRange(editor, {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 2], offset: 0 },
  })
}
export const output = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [0, 0], offset: 3 },
}
