/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const run = editor => {
  editor.wrapNodes(<block new />, { split: true })
}

export const output = (
  <value>
    <block new>
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)
