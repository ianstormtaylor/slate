/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor) => {
  Transforms.deleteContent(editor, { unit: 'word', reverse: true })
}
export const input = (
  <editor>
    <block>
      one two three
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one two <cursor />
    </block>
  </editor>
)
