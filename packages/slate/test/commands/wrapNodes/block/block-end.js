/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>
      <anchor />two
    </block>
    <block>
      three<focus />
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block a />)
}

export const output = (
  <value>
    <block>one</block>
    <block a>
      <block>
        <anchor />two
      </block>
      <block>
        three<focus />
      </block>
    </block>
  </value>
)
