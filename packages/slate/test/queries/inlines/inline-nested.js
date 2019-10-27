/** @jsx h */

import { h } from '../../helpers'

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
  return Array.from(editor.inlines())
}

export const output = [
  [
    <inline>
      two<inline>three</inline>four
    </inline>,
    [0, 1],
  ],
  [<inline>three</inline>, [0, 1, 1]],
]
