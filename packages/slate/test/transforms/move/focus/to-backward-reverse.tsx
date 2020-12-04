/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'focus', reverse: true, distance: 10 })
}
export const input = (
  <editor>
    <block>
      one <anchor />
      two thr
      <focus />
      ee
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
