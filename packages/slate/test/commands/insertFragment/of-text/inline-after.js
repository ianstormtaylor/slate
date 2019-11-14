/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(<fragment>fragment</fragment>)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      fragment
      <cursor />
    </block>
  </value>
)
