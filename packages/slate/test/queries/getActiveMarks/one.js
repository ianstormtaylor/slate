/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">
        o<cursor />ne
      </mark>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = [{ key: 'a' }]
