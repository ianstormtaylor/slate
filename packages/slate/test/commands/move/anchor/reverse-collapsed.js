/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'anchor', reverse: true })
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
