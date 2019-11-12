/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'word', reverse: true })
}

export const input = (
  <value>
    <block>word</block>
    <block>
      <cursor />another
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word<cursor />another
    </block>
  </value>
)
