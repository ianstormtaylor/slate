/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">
        o<cursor marks={[{ key: 'b' }]} />ne
      </mark>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks())
}

export const output = [{ key: 'b' }]
