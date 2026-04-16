/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      one
      <inline>
        two<inline>three</inline>four
      </inline>
      five
    </block>
  </editor>
)
export const test = (editor) => {
  const inline = editor.children[0].children[1]
  return Editor.hasBlocks(editor, inline)
}
export const output = false
