/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEnd()
}

export const input = (
  <value>
    <block>
      one <anchor />two t<focus />hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one <anchor />two th<focus />ree
    </block>
  </value>
)
