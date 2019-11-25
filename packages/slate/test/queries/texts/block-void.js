/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block void>one</block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.texts(editor, { at: [] }))
}

export const output = []
