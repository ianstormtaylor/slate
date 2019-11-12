/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />a
      </mark>
      <mark key="b">
        wo<focus />rd
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />a
      </mark>
      <mark key="a">
        <mark key="b">
          wo<focus />
        </mark>
      </mark>
      <mark key="b">rd</mark>
    </block>
  </value>
)
