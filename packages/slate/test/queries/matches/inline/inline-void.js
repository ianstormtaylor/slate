/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline void>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ at: [], match: 'inline' }))
}

export const output = [
  [<text>one</text>, [0, 0]],
  [<inline void>two</inline>, [0, 1]],
  [<text>three</text>, [0, 2]],
]
