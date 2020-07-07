/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { edge: 'focus', reverse: true })
}
export const input = (
  <editor>
    <block>
      one two t<cursor />
      hree
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one two <focus />t<anchor />
      hree
    </block>
  </editor>
)
