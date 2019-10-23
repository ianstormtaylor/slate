/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'start' })
}

export const input = (
  <value>
    <block>
      one <focus />two t<anchor />hree
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<focus />wo t<anchor />hree
    </block>
  </value>
)
