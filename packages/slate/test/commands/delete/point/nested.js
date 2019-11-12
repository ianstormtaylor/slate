/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <block>
        word<cursor />
      </block>
      <block>another</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        word<cursor />another
      </block>
    </block>
  </value>
)
