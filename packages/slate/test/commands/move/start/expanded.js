/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'start' })
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
      one t<anchor />wo t<focus />hree
    </block>
  </value>
)
