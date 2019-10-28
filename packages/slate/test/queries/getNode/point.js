/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getNode({ path: [0, 0], offset: 1 })
}

export const output = [<text>one</text>, [0, 0]]
