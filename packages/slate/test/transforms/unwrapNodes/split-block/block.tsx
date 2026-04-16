/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.a, split: true })
}
export const input = (
  <editor>
    <block a>
      <block>
        <cursor />
        one
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
