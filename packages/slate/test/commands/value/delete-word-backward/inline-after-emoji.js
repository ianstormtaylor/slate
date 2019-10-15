/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteWordBackward()
}

export const input = (
  <value>
    <block>
      <inline>word</inline>📛<cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)
