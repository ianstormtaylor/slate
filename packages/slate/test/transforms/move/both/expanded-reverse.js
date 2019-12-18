/** @jsx jsx */

import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { reverse: true })
}

export const input = (
  <editor>
    <block>
      one <anchor />
      two th
      <focus />
      ree
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <anchor /> two t<focus />
      hree
    </block>
  </editor>
)
