/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(
    Editor.nodes(editor, { at: [], match: 'inline', mode: 'highest' })
  )
}

export const output = [
  [<text>one</text>, [0, 0]],
  [<inline>two</inline>, [0, 1]],
  [<text>three</text>, [0, 2]],
]
