/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three<inline>four</inline>five
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.inlines({ reverse: true }))
}

export const output = [
  [<inline>four</inline>, [0, 3]],
  [<inline>two</inline>, [0, 1]],
]
