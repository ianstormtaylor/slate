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
  return Array.from(editor.rootInlines())
}

export const output = [
  [<inline>two</inline>, [0, 1]],
  [<inline>four</inline>, [0, 3]],
]
