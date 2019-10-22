/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'word', reverse: true })
}

export const input = (
  <value>
    <block>
      one two thr<cursor />ee
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two <cursor />ee
    </block>
  </value>
)
