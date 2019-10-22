/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      one<inline>
        <cursor />a
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
      </inline>two
    </block>
  </value>
)
