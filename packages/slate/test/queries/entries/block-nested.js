/** @jsx h */

import { h } from '../../../helpers'

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
  return Array.from(editor.entries())
}

export const output = [
  [
    <value>
      <block>
        <block>one</block>
      </block>
      <block>
        <block>two</block>
      </block>
    </value>,
    [],
  ],
  [
    <block>
      <block>one</block>
    </block>,
    [0],
  ],
  [<block>one</block>, [0, 0]],
  [<text>one</text>, [0, 0, 0]],
  [
    <block>
      <block>two</block>
    </block>,
    [1],
  ],
  [<block>two</block>, [1, 0]],
  [<text>two</text>, [1, 0, 0]],
]
