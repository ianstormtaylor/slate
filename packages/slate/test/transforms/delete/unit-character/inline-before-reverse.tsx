/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor) => {
  Transforms.deleteContent(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      a<cursor />
      <inline>two</inline>
      three
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      <inline>two</inline>
      three
    </block>
  </editor>
)
