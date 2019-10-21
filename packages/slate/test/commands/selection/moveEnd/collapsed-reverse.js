/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveEnd({ reverse: true })
}

export const input = (
  <value>
    <block>
      one two t<cursor />hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one two <focus />t<anchor />hree
    </block>
  </value>
)
