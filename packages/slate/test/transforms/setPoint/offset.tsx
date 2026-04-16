/** @jsx jsx */

import { jsx } from '../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
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
