/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'character' })
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
      a
      <inline>
        <cursor />
        wo
      </inline>
      three
    </block>
  </editor>
)
