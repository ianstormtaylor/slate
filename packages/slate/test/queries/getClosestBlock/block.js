/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return editor.getMatch([0, 0], 'block')
}

export const output = [<block>one</block>, [0]]
