/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      one<inline void>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.inlines())
}

export const output = [[<inline void>two</inline>, [0, 1]]]
