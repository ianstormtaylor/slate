/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ match: 'inline' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        w<anchor />or<focus />d
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>w</inline>
      <text />
      <inline>
        <cursor />d
      </inline>
      <text />
    </block>
  </value>
)

export const skip = true
