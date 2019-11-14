/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />w
      </mark>
      <focus />
      ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />w<focus />
      ord
    </block>
  </value>
)
