/** @jsx h */

import { h } from '../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block a>
      o<anchor />ne
    </block>
    <block b>
      tw<focus />o
    </block>
  </value>
)

export const output = input

export const skip = true
