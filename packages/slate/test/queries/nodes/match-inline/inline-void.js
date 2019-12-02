/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline void>two</inline>three
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: 'inline', mode: 'highest' })
  )
}

export const output = [[<inline void>two</inline>, [0, 1]]]
