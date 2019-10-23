/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'start', reverse: true })
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
      one<anchor /> two t<focus />hree
    </block>
  </value>
)
