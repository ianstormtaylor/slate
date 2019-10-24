/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ thing: true }, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <anchor />word
    </block>
    <block>
      a<focus />nother
    </block>
  </value>
)

export const output = (
  <value>
    <block thing>
      <anchor />word
    </block>
    <block thing>
      a<focus />nother
    </block>
  </value>
)
