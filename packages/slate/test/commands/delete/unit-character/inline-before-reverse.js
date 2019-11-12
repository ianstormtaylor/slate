/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ unit: 'character', reverse: true })
}

export const input = (
  <value>
    <block>
      a<cursor />
      <inline>two</inline>
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      <inline>two</inline>
      three
    </block>
  </value>
)
