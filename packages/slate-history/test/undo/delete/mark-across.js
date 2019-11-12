/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <mark key="a">
        on<anchor />e
      </mark>
      <mark key="c">
        tw<focus />o
      </mark>
    </block>
  </value>
)

export const output = input

export const skip = true
