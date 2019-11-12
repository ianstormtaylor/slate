/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      wo
      <mark key="b">
        <anchor />rd
      </mark>
    </block>
    <block>
      <mark key="b">an</mark>
      <focus />other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark key="a">
        <mark key="b">
          <anchor />rd
        </mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">an</mark>
      </mark>
      <focus />other
    </block>
  </value>
)
