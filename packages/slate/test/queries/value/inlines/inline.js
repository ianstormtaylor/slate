/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.inlines())
}

export const output = [[<inline>two</inline>, [0, 1]]]
