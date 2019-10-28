/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getEdges([0])
}

export const output = [{ path: [0, 0], offset: 0 }, { path: [0, 0], offset: 3 }]
