/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setMarkAtPath(
    [0, 0],
    {
      key: 'a',
    },
    {
      key: 'b',
    }
  )
}

export const input = (
  <value>
    <block>
      <mark key="a">word</mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="b">word</mark>
    </block>
  </value>
)
