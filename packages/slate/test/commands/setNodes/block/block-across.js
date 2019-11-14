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
      a<focus />
      nother
    </block>
  </value>
)

export const output = (
  <value>
    <block key>
      <anchor />
      word
    </block>
    <block key>
      a<focus />
      nother
    </block>
  </value>
)
