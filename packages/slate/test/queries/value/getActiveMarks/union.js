/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />o
      </mark>n<mark key="b">
        e<focus />
      </mark>
    </block>
  </value>
)

export const run = editor => {
  return Array.from(editor.getActiveMarks({ union: true }))
}

export const output = [{ key: 'a' }, { key: 'b' }]
