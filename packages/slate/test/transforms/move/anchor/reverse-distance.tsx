/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'anchor', reverse: true, distance: 3 })
}
export const input = (
  <editor>
    <block>
      one <anchor />
      tw
      <focus />o three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      o<anchor />
      ne tw
      <focus />o three
    </block>
  </editor>
)
