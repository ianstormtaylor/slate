/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.move({ edge: 'end', reverse: true, distance: 7 })
}

export const input = (
  <value>
    <block>
      one <focus />
      two <anchor />
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      o<anchor />
      ne <focus />
      two three
    </block>
  </value>
)
