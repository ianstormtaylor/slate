/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  editor.delete()
}

export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)

export const output = input

export const skip = true
