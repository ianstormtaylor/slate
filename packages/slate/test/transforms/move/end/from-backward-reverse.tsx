/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'end', reverse: true, distance: 7 })
}
export const input = (
  <editor>
    <block>
      one <focus />
      two <anchor />
      three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      o<anchor />
      ne <focus />
      two three
    </block>
  </editor>
)
