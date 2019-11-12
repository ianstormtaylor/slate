/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      one<inline>two</inline>
      <anchor />a<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one<inline>two</inline>
      <text>
        <cursor />
      </text>
    </block>
  </value>
)
