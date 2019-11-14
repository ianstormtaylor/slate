/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.insertNodes(<block a>two</block>)
}

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const output = input
