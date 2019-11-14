/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: true }, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block key>
        <cursor />
        word
      </block>
    </block>
  </value>
)
