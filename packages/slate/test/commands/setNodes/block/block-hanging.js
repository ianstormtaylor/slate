/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: true }, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </value>
)

export const output = (
  <value>
    <block key>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </value>
)
