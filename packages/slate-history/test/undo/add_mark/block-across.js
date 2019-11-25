/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'add_mark', mark: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      o<anchor />
      ne
    </block>
    <block>
      tw
      <focus />o
    </block>
  </value>
)

export const output = input
