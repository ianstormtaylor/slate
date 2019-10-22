/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <inline void>
        <anchor />
      </inline>
      <focus />abc
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />abc
    </block>
  </value>
)

export const skip = true