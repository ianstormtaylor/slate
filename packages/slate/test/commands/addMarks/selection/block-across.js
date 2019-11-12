/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      wo<anchor />rd
    </block>
    <block>
      an<focus />other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark key="a">
        <anchor />rd
      </mark>
    </block>
    <block>
      <mark key="a">
        an<focus />
      </mark>
      other
    </block>
  </value>
)
