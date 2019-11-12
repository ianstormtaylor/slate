/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <block>
        <block>
          word<anchor />
        </block>
        <block>
          <focus />another
        </block>
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        <block>
          word<cursor />another
        </block>
      </block>
    </block>
  </value>
)
