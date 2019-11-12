/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'end' })
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
      one two t<anchor />h<focus />ree
    </block>
  </value>
)
