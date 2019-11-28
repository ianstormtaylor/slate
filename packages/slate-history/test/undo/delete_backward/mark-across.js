/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  editor.delete()
}

export const input = (
  <editor>
    <block>
      <mark key="a">
        on
        <anchor />e
      </mark>
      <mark key="c">
        tw
        <focus />o
      </mark>
    </block>
  </editor>
)

export const output = input

export const skip = true
