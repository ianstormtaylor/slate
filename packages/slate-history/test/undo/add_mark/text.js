/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'add_mark', mark: { key: 'a' } })
}

export const input = (
  <value>
    <block>
      <anchor />
      wo
      <focus />
      rd
    </block>
  </value>
)

export const output = input
