/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline()
}

export const input = (
  <value>
    <block>
      <inline>
        wo<cursor />rd
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>wo</inline>
      <inline>
        <cursor />rd
      </inline>
    </block>
  </value>
)
