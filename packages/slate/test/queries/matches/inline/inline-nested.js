/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>
        two<inline>three</inline>four
      </inline>five
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.matches({ at: [], match: 'inline' }))
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
