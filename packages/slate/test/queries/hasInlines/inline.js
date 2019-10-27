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
  const block = editor.value.nodes[0]
  return editor.hasInlines(block)
}

export const output = true
