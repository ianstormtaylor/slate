/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline()
}

export const input = (
  <value>
    <block>
      <inline>
        word<cursor />
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>word</inline>
      <inline>
        <cursor />
      </inline>
    </block>
  </value>
)
