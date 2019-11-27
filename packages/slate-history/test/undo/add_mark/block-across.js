/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'add_mark', mark: { key: 'a' } })
}

export const input = (
  <editor>
    <block>
      o<anchor />
      ne
    </block>
    <block>
      tw
      <focus />o
    </block>
  </editor>
)

export const output = input
