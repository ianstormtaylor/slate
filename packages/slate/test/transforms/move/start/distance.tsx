/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.move(editor, { edge: 'start', distance: 3 })
}
export const input = (
  <editor>
    <block>
      one <anchor />
      two t<focus />
      hree
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one two
      <anchor /> t<focus />
      hree
    </block>
  </editor>
)
