/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodes({ thing: true }, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <block>
        <cursor />word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block thing>
      <block thing>
        <cursor />word
      </block>
    </block>
  </value>
)
