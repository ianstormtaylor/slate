/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'start', distance: 8 })
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
      one two t<focus />hre<anchor />e
    </block>
  </value>
)
