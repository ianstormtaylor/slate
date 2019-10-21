/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.moveStart({ reverse: true })
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
      one two <anchor />t<focus />hree
    </block>
  </value>
)
