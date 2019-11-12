/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'anchor' })
}

export const input = (
  <value>
    <block>
      one <anchor />tw<focus />o three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one t<anchor />w<focus />o three
    </block>
  </value>
)
