/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertBlock('quote')
}

export const input = (
  <value>
    <block>
      <text />
      <emoji>
        <cursor />
      </emoji>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <emoji />
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>
      <text />
    </block>
  </value>
)
