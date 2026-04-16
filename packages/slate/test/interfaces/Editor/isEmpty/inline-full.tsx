/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)
export const test = (editor) => {
  const inline = editor.children[0].children[1]
  return Editor.isEmpty(editor, inline)
}
export const output = false
