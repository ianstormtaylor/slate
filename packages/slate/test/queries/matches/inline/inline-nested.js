/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <inline>
        two<inline>three</inline>four
      </inline>
      five
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.matches(editor, { at: [], match: 'inline' }))
}

export const output = [
  [<text>one</text>, [0, 0]],
  [
    <inline>
      two<inline>three</inline>four
    </inline>,
    [0, 1],
  ],
  [<text>five</text>, [0, 2]],
]
