/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitInline()
}

export const input = (
  <value>
    <block>
      <inline>
        <cursor />word
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <inline>
        <text />
      </inline>
      <inline>
        <cursor />word
      </inline>
    </block>
  </value>
)
