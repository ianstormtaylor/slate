/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      on<cursor />e
    </block>
    <block void>
      <text />
    </block>
    <block>three</block>
  </value>
)

export const output = (
  <value>
    <block>
      on<cursor />
    </block>
    <block void>
      <text />
    </block>
    <block>three</block>
  </value>
)
