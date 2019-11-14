/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
  editor.insertText('b')
}

export const input = (
  <value>
    <block>
      <mark key="a">
        <anchor />
        one
      </mark>
    </block>
    <block>
      two
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      ab
      <cursor />
    </block>
  </value>
)

export const skip = true
