/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three<inline>four</inline>five
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ at: [], match: 'inline', reverse: true }))
}

export const output = [
  [<text>five</text>, [0, 4]],
  [<inline>four</inline>, [0, 3]],
  [<text>three</text>, [0, 2]],
  [<inline>two</inline>, [0, 1]],
  [<text>one</text>, [0, 0]],
]
