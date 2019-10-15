/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline(1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <text />
        <inline>
          wo<cursor />rd
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <text />
        <inline>wo</inline>
        <text />
        <inline>
          <cursor />rd
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
