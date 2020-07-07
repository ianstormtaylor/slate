/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'end', reverse: true, distance: 6 })
}
export const input = (
  <editor>
    <block>
      one <anchor />
      two
      <focus /> three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      o<focus />
      ne <anchor />
      two three
    </block>
  </editor>
)
