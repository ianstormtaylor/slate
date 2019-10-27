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
  return Array.from(editor.rootBlocks())
}

export const output = [
  [
    <block>
      one<inline>two</inline>three
    </block>,
    [0],
  ],
]
