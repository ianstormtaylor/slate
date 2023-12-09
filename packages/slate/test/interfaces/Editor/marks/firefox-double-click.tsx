/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

/**
 * This test verifies that when double clicking a marked word in Firefox,
 * Editor.marks for the resulting selection includes the marked word. Double
 * clicking a marked word in Firefox results in a selection that starts at the
 * end of the previous text node and ends at the end of the marked text node.
 */

export const input = (
  <editor>
    <block>
      plain <anchor />
      <text bold>
        bold
        <focus />
      </text>
      <text> plain</text>
    </block>
    <block>block two</block>
  </editor>
)
export const test = editor => {
  return Editor.marks(editor)
}
export const output = { bold: true }
