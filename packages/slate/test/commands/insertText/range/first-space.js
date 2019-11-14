/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText(' ')
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      {' '}
      <cursor />
      word
    </block>
  </value>
)
