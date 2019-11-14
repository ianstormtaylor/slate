/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      w<anchor />o<focus />
      rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a">
        <anchor />o<focus />
      </mark>
      rd
    </block>
  </value>
)
