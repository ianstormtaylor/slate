/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.move(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        word5️⃣
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        word
        <cursor />
        5️⃣
      </inline>
      <text />
    </block>
  </editor>
)
