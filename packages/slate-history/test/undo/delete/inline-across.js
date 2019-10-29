/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <text />
      <inline a>
        o<anchor />ne
      </inline>
      <text />
    </block>
    <block>
      <text />
      <inline b>
        tw<focus />o
      </inline>
      <text />
    </block>
  </value>
)

export const output = input

export const skip = true
