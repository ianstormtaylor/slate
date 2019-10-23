/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setBlocks({ type: 'code' })
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

    <block>
      <anchor />word
      </block>
    <block>
      a<focus />nother
      </block>

  </value>
)
