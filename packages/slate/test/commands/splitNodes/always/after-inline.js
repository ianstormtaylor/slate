/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'block', always: true })
}

export const input = (
  <value>
    <block>
      word
      <inline>hyperlink</inline>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <inline>hyperlink</inline>
      <text />
    </block>
    <block>
      <cursor />
      word
    </block>
  </value>
)
