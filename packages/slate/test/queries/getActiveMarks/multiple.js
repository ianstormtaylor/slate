/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">
        <mark key="b">
          o<cursor />ne
        </mark>
      </mark>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = [{ key: 'b' }, { key: 'a' }]
