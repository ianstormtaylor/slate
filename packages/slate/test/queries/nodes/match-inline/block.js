/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)

export const run = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: 'inline', mode: 'highest' })
  )
}

export const output = []
