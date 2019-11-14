/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move()
}

export const input = (
  <value>
    <block>
      one <focus />
      two th
      <anchor />
      ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<focus />
      wo thr
      <anchor />
      ee
    </block>
  </value>
)
