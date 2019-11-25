/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Editor.path(editor, { path: [0, 0], offset: 1 })
}

export const output = [0, 0]
