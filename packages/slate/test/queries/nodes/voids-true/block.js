/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>one</block>
  </editor>
)

export const run = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: 'text', voids: true })
  )
}

export const output = [[<text>one</text>, [0, 0]]]
