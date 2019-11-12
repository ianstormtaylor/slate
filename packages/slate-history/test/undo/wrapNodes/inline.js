/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.wrapNodes(<inline />)
}

export const input = (
  <value>
    <block>
      wo<anchor />rd
    </block>
    <block>
      an<focus />other
    </block>
  </value>
)

export const output = input
