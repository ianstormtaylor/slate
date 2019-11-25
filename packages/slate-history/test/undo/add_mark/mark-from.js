/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'add_mark', mark: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      <mark key="a">
        w<anchor />o
      </mark>
      r<focus />d
    </block>
  </value>
)

export const output = input
