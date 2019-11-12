/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return editor.getPrevious([1], 'text')
}

export const output = [<text>one</text>, [0, 0]]
