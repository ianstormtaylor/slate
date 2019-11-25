/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.matches(editor, { at: [], match: 'inline' }))
}

export const output = [[<text>one</text>, [0, 0]]]
