/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'anchor' })
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
      one t<anchor />
      wo th
      <focus />
      ree
    </block>
  </editor>
)
