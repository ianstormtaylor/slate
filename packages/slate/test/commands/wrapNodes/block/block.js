/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.wrapNodes(<block a />)
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block a>
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)
