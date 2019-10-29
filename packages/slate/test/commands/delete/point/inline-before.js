/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      word<cursor />
    </block>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word<cursor />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </value>
)
