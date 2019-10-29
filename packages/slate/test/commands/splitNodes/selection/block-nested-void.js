/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>
      <block void>
        wo<anchor />rd
      </block>
      <block void>
        an<focus />other
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)
