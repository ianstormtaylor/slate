/** @jsx jsx */
/* The starting selection range is not hanging, so should not be adjusted */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <anchor />
      This is the first paragraph
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      This is the second paragraph
      <inline void>
        <text />
      </inline>
      <text>
        <focus />
      </text>
    </block>
    <block>This is the third paragraph</block>
  </editor>
)

export const test = editor => {
  return Editor.unhangRange(editor, editor.selection, { voids: true })
}

export const output = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [1, 2], offset: 0 },
}
