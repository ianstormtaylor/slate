/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'block', always: true })
}

export const input = (
  <value>
    <block>word</block>
    <block>
      <cursor />
      another
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
    <block>
      <text />
    </block>
    <block>
      <cursor />
      another
    </block>
  </value>
)
