/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveAnchor({ reverse: true })
}

export const input = (
  <value>
    <block>
      one <focus />two th<anchor />ree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one <focus />two t<anchor />hree
    </block>
  </value>
)
