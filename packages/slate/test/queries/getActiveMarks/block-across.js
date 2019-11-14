/** @jsx jsx */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">
        <mark key="b">
          o<anchor />
          ne
        </mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">
          o<focus />
          ne
        </mark>
      </mark>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = [{ key: 'b' }, { key: 'a' }]
