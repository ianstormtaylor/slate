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
    <block>
      <focus />
      two
    </block>
  </value>
)

// TODO: the hanging selection here isn't right
export const output = (
  <value>
    <block>
      a<cursor />
    </block>
    <block>two</block>
  </value>
)

export const skip = true
