/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <cursor />
      word
    </block>
  </editor>
)
