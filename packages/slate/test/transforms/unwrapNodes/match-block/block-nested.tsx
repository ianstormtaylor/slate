/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.a })
}
export const input = (
  <editor>
    <block a>
      <block>
        <block>
          <cursor />
          word
        </block>
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>
        <cursor />
        word
      </block>
    </block>
  </editor>
)
