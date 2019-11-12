/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: 'a' }, { at: [0, 0] })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      <text key="a">word</text>
    </block>
  </value>
)
