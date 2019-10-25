/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ depth: 'block' })
}

export const input = (
  <value>
    <block>
      word<inline>
        <cursor />hyperlink
      </inline>word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <inline>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline>
        <cursor />hyperlink
      </inline>
      word
    </block>
  </value>
)
