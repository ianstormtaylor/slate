/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
  </value>
)

export const run = editor => {
  return editor.getMatch([0, 0, 0], 'block')
}

export const output = [<block>one</block>, [0, 0]]
