/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
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
        one<inline>two</inline>three
      </block>
    </value>,
    [],
  ],
  [
    <block>
      one<inline>two</inline>three
    </block>,
    [0],
  ],
  [<text>one</text>, [0, 0]],
  [<inline>two</inline>, [0, 1]],
  [<text>two</text>, [0, 1, 0]],
  [<text>three</text>, [0, 2]],
]
