/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEnd({ reverse: true })
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
      one <anchor />two <focus />three
    </block>
  </value>
)
