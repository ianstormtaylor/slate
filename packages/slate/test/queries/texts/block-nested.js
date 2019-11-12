/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.texts({ at: [] }))
}

export const output = [
  [<text>one</text>, [0, 0, 0]],
  [<text>two</text>, [1, 0, 0]],
]
