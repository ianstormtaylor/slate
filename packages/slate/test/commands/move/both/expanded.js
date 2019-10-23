/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.move()
}

export const input = (
  <value>
    <block>
      one <anchor />two th<focus />ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<anchor />wo thr<focus />ee
    </block>
  </value>
)
