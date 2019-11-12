/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <anchor />w<focus />ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />w<focus />
      </mark>
      ord
    </block>
  </value>
)
