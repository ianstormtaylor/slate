/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ reverse: true })
}

export const input = (
  <value>
    <block>Hello</block>
    <block>
      <block>
        <cursor />world!
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      Hello<cursor />world!
    </block>
  </value>
)
