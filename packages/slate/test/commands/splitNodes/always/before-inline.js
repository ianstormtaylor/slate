/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'block', always: true })
}

export const input = (
  <value>
    <block>
      word<cursor />
      <inline>hyperlink</inline>
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
    <block>
      <cursor />
      <inline>hyperlink</inline>
      word
    </block>
  </value>
)
