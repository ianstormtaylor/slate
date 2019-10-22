/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      one
      <inline void>
        <anchor />
      </inline>
      two
    </block>
    <block>
      <focus />three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one<cursor />three
    </block>
  </value>
)

export const skip = true