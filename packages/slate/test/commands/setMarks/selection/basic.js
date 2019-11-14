/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setMarks([{ key: 'a' }], { thing: true })
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a" thing>
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </value>
)
