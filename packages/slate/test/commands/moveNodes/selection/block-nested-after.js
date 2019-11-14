/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.moveNodes({ match: ([, p]) => p.length === 2, to: [1] })
}

export const input = (
  <value>
    <block>
      <block>one</block>
      <block>
        <anchor />
        two
      </block>
      <block>
        three
        <focus />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <anchor />
      two
    </block>
    <block>
      three
      <focus />
    </block>
  </value>
)
