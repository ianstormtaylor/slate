/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        before
        <anchor />
      </text>
      <text>selected</text>
      <text>
        <focus />
        after
      </text>
    </block>
  </editor>
)

export const test = editor => {
  return Editor.unhangRange(editor, editor.selection)
}

export const output = {
  anchor: { path: [0, 0], offset: 6 },
  focus: { path: [0, 2], offset: 0 },
}
