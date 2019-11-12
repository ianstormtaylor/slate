/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ key: 'a' }, { at: [0, 1] })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline key="a">word</inline>
      <text />
    </block>
  </value>
)
