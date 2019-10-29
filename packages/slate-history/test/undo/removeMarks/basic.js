/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.removeMarks([{ key: true }])
}

export const input = (
  <value>
    <block>
      <mark key>
        <anchor />one<focus />
      </mark>
    </block>
  </value>
)

export const output = input
