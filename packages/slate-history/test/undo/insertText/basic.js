/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.insertText('text')
}

export const input = (
  <value>
    <block>
      one
      <cursor />
    </block>
  </value>
)

export const output = input
