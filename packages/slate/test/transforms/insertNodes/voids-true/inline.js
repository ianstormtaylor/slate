/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <inline void>
        two
        <cursor />
      </inline>
      three
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertNodes(editor, <text>four</text>, {
    at: [0, 1, 1],
    voids: true,
  })
}

export const output = (
  <editor>
    <block>
      one
      <inline void>
        twofour
        <cursor />
      </inline>
      three
    </block>
  </editor>
)
