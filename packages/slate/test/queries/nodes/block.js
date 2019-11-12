/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(editor.nodes({ at: [] }))
}

export const output = [
  [
    <value>
      <block>one</block>
    </value>,
    [],
  ],
  [<block>one</block>, [0]],
  [<text>one</text>, [0, 0]],
]
