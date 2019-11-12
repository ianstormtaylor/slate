/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return editor.getNext([0], 'text')
}

export const output = [<text>two</text>, [1, 0]]
