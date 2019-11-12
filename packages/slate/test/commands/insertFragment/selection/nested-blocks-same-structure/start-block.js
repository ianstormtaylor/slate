/** @jsx jsx */

import { jsx } from '../../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <block>
      <block>2</block>
    </block>
  )
}

export const input = (
  <value>
    <block>
      <block>
        {'1 '}
        <cursor />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>
        1 2<cursor />
      </block>
    </block>
  </value>
)

export const skip = true
