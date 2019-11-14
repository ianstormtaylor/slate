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

export const output = (
  <value>
    <block>
      a<cursor />
      two
    </block>
  </value>
)

export const skip = true
