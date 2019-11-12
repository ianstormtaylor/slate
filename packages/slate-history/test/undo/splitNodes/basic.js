/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>
      <block>
        on<cursor />e
      </block>
      <block>two</block>
    </block>
  </value>
)

export const output = input
