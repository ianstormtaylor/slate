/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  editor.insertNodes(<block>two</block>)
}

export const output = (
  <value>
    <block>one</block>
    <block>
      two<cursor />
    </block>
  </value>
)
