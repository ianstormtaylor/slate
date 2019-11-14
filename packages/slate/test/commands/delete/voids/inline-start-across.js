/** @jsx jsx */

import { jsx } from '../../../helpers'

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
      three <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
    </block>
  </value>
)
