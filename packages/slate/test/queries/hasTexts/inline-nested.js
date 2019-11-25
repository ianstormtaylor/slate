/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      one
      <inline>
        two<inline>three</inline>four
      </inline>
      five
    </block>
  </value>
)

export const run = editor => {
  const inline = editor.value.children[0].children[1]
  return Editor.hasTexts(editor, inline)
}

export const output = false
