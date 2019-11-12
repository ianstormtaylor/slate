/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'anchor', distance: 3 })
}

export const input = (
  <value>
    <block>
      one <anchor />two thr<focus />ee
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two<anchor /> thr<focus />ee
    </block>
  </value>
)
