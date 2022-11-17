/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      plain
      <text bold>
        text that is
        <cursor />
        bold
      </text>
      <text bold italic>
        bold italic
      </text>
    </block>
    <block>block two</block>
  </editor>
)
export const test = editor => {
  return Editor.marks(editor)
}
export const output = { bold: true }
