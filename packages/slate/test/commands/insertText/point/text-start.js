/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertText('x', { at: { path: [0, 0], offset: 0 } })
}

export const input = (
  <value>
    <block>
      <text>
        wo<cursor />rd
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      xwo<cursor />rd
    </block>
  </value>
)
