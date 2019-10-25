/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.mergeNodes({ at: { path: [1, 0], offset: 0 }, depth: 'block' })
}

export const output = (
  <value>
    <block>onetwo</block>
  </value>
)
