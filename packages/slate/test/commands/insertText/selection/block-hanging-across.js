/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertText('a')
}

export const input = (
  <value>
    <block>
      <anchor />
      one
    </block>
    <block>two</block>
    <block>
      <focus />
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      a<cursor />
      three
    </block>
  </value>
)

export const skip = true
