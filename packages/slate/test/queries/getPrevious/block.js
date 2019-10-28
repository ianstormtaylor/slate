/** @jsx h */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return editor.getPrevious([1], 'block')
}

export const output = [<block>one</block>, [0]]
