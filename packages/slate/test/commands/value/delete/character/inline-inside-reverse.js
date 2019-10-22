/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    <block>
      one<inline>
        a<cursor />
      </inline>two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
      <inline>
        <text />
      </inline>
      two
    </block>
  </value>
)
