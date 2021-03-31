/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Transforms.move(editor)
  Transforms.setPoint(editor, { offset: 0 }, { edge: 'focus' })
}
export const input = (
  <editor>
    <block>
      f<cursor />
      oo
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <focus />
      fo
      <anchor />o
    </block>
  </editor>
)
