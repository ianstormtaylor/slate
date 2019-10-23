/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <anchor />word<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />word<focus />
      </mark>
    </block>
  </value>
)
