/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>
        <anchor />
        This is a first paragraph
      </text>
    </block>
    <block>
      <text>This is the second paragraph</text>
    </block>
    <block void>
      <text />
    </block>
    <block>
      <text>
        <focus />
      </text>
    </block>
  </editor>
)
export const run = editor => {
  editor.deleteFragment(editor)
}
export const output = (
  <editor>
    <block>
      <text>
        <cursor />
      </text>
    </block>
    <block>
      <text />
    </block>
  </editor>
)
