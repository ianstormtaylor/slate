/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodes(<text>another</text>, { at: [0, 0] })
}

export const output = (
  <value>
    <block>
      another
      <cursor />
      word
    </block>
  </value>
)
