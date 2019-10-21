/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchor()
}

export const input = (
  <value>
    <block>
      one <anchor />tw<focus />o three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<anchor />w<focus />o three
    </block>
  </value>
)
