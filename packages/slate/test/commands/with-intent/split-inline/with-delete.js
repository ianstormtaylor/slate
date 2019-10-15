/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline()
}

export const input = (
  <value>
    <block>
      <inline>
        w<anchor />or<focus />d
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>w</inline>
      <inline>
        <cursor />d
      </inline>
    </block>
  </value>
)
