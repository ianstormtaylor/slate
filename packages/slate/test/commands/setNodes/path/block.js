/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const run = editor => {
  editor.setNodes({ key: 'a' }, { at: [0] })
}

export const output = (
  <value>
    <block key="a">word</block>
  </value>
)
