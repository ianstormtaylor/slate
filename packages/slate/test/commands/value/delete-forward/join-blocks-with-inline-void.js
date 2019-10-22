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
      <inline void>
        <text />
      </inline>
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
    </block>
  </value>
)
