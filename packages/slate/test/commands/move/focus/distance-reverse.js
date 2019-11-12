/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'focus', reverse: true, distance: 6 })
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
      one <anchor />t<focus />wo three
    </block>
  </value>
)
