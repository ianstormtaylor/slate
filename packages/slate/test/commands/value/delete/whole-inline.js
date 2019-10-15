/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <inline>
        <anchor />word<focus />
      </inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
      <inline>
        <text />
      </inline>
    </block>
  </value>
)
