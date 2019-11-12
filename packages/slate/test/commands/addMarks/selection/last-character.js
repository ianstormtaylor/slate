/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      wor<anchor />d<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wor
      <mark key="a">
        <anchor />d<focus />
      </mark>
    </block>
  </value>
)
