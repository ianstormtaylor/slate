/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(<fragment>fragment</fragment>)
}

export const input = (
  <value>
    <block>
      <cursor />
      <inline>word</inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      fragment
      <cursor />
      <inline>word</inline>
      <text />
    </block>
  </value>
)
