/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 2 })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        wo<cursor />rd
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>wo</inline>
      <text />
      <inline>
        <cursor />rd
      </inline>
      <text />
    </block>
  </value>
)
