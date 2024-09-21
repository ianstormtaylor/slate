/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

/**
 * Similar to firefox-double-click.tsx, when the selection is at the end of
 * the previous node's path, using Editor.marks retrieves the marks of that node.
 * However, when addMark is triggered, that node is not within the range for
 * adding marks,  thus failing to transfer the state correctly.
 */

export const input = (
  <editor>
    <block>
      <text>
        block one
        <focus />
      </text>
    </block>
    <block>
      <text bold>block two</text>
    </block>
    <block>
      <text bold>
        block three
        <anchor />
      </text>
    </block>
  </editor>
)

export const test = editor => {
  return Editor.marks(editor)
}

export const output = { bold: true }
