/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block void>one</block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.texts(editor, { at: [] }))
}

export const output = []
