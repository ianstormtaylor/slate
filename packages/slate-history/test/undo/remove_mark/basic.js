/** @jsx jsx */

import { jsx } from '../..'

export const run = editor => {
  editor.exec({ type: 'remove_mark', mark: { key: true } })
}

export const input = (
  <editor>
    <block>
      <mark key>
        <anchor />
        one
        <focus />
      </mark>
    </block>
  </editor>
)

export const output = input
