/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        <anchor />
      </text>
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text>
        <focus />
      </text>
    </block>
  </editor>
)

export const test = editor => {
  return Editor.unhangRange(editor, editor.selection, { voids: false })
}

export const output = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [1, 1, 0], offset: 0 },
}
