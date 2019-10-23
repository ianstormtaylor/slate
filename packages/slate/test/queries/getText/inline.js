/** @jsx h  */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return editor.getText([0, 1])
}

export const output = `two`
