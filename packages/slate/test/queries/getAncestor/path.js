/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getAncestor([0, 0])
}

export const output = [<block>one</block>, [0]]
