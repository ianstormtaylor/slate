/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'line', reverse: true })
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
      <cursor />ee
    </block>
  </value>
)
